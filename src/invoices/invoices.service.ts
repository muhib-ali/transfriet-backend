import {
  Injectable, BadRequestException, NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { Invoice } from "../entities/invoice.entity";
import { InvoiceItem } from "../entities/invoice-item.entity";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { InvoiceListQueryDto } from "./dto/invoice-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";
import { Client } from "../entities/client.entity";
import { JobFile } from "../entities/job-file.entity";
import { Subcategory } from "../entities/subcategory.entity";
import { Tax } from "../entities/tax.entity";
import { InvoiceCounter } from "../entities/invoice-counter.entity";
import { Quotation } from "../entities/quotation.entity";
import { QuotationItem } from "../entities/quotation-item.entity";

@Injectable()
export class InvoicesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceItem) private itemRepo: Repository<InvoiceItem>,
    @InjectRepository(Subcategory) private subRepo: Repository<Subcategory>,
    @InjectRepository(Quotation) private quotationRepo: Repository<Quotation>,
    @InjectRepository(QuotationItem) private quotationItemRepo: Repository<QuotationItem>,
  ) {}

  private async nextInvoiceNumber(qr: ReturnType<DataSource["createQueryRunner"]>): Promise<string> {
    const year = new Date().getFullYear();
    const rows = await qr.manager.query(
      `
      INSERT INTO invoice_counters("year","last_serial","updated_at")
      VALUES ($1, 1, now())
      ON CONFLICT("year")
      DO UPDATE SET last_serial = invoice_counters.last_serial + 1, updated_at = now()
      RETURNING last_serial;
      `,
      [year]
    );
    const serial = Number(rows[0].last_serial);
    const padded = String(serial).padStart(3, "0");
    return `INV-${year}-${padded}`;
  }

 async create(dto: CreateInvoiceDto): Promise<ApiResponse<Invoice>> {
  // NOTE: items ki requirement tumhare DTO me ArrayMinSize(1) hai.
  // Agar tum chaho to quotation se prefill karne ke liye items optional kar sakte ho.
  if (!dto.items?.length && !dto.quotation_id) {
    throw new BadRequestException("At least one item is required");
  }

  const qr = this.dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    // 1) Optional quotation preload + lock
    let quotation: Quotation | null = null;
    if (dto.quotation_id) {
      quotation = await qr.manager.findOne(Quotation, {
        where: { id: dto.quotation_id },
        lock: { mode: "pessimistic_write" }, // <-- prevents race for the flag
      });
      if (!quotation) throw new BadRequestException("Invalid quotation_id");

      // single-invoice-per-quotation policy (optional but recommended)
      if (quotation.isInvoiceCreated) {
        throw new BadRequestException("Invoice already created for this quotation");
      }
    }

    // 2) Validate foreigns
    const customer = await qr.manager.findOne(Client, { where: { id: dto.customer_id } });
    if (!customer) throw new BadRequestException("Invalid customer_id");

    let jobFile: JobFile | null = null;
    if (dto.job_file_id) {
      jobFile = await qr.manager.findOne(JobFile, { where: { id: dto.job_file_id } });
      if (!jobFile) throw new BadRequestException("Invalid job_file_id");
    }

    let subcategories: Subcategory[] = [];
    if (dto.subcategory_ids?.length) {
      subcategories = await qr.manager.findBy(Subcategory, { id: In(dto.subcategory_ids) });
      if (subcategories.length !== dto.subcategory_ids.length) {
        throw new BadRequestException("One or more subcategory_ids are invalid");
      }
    } else if (quotation) {
      // (optional) prefill subcategories from quotation if not provided
      subcategories = await qr.manager
        .createQueryBuilder(Subcategory, "s")
        .innerJoin("quotation_subcategories", "qs", "qs.subcategory_id = s.id")
        .where("qs.quotation_id = :qid", { qid: quotation.id })
        .getMany();
    }

    const invoice_number = await this.nextInvoiceNumber(qr);

    // 3) Resolve items
    let items = dto.items ?? [];
    if ((!items || items.length === 0) && quotation) {
      // (optional) prefill items from quotation_items
      const qItems = await qr.manager.find(QuotationItem, { where: { quotation_id: quotation.id } });
      items = qItems.map((qi) => ({
        product_id: qi.product_id,
        tax_id: (qi as any).tax_id ?? null,
        quantity: qi.quantity,
        unit_price: Number(qi.unit_price),
      }));
      if (items.length === 0) throw new BadRequestException("Quotation has no items to copy");
    }

    // 4) Totals
    let subtotal = 0;
    let taxTotal = 0;
    for (const it of items) {
      const line = it.quantity * it.unit_price;
      subtotal += line;
      if (it.tax_id) {
        const row = await qr.manager.query(`SELECT value FROM taxes WHERE id = $1`, [it.tax_id]);
        const p = Number(row?.[0]?.value ?? 0);
        taxTotal += line * (p / 100);
      }
    }
    const grand = subtotal + taxTotal;

    // 5) Create invoice
    const invoice = qr.manager.create(Invoice, {
      invoice_number,
      valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
      quotation: quotation ?? null,
      customer,
      category: jobFile ?? null,
      subcategories,
      shipper_name: dto.shipper_name ?? null,
      consignee_name: dto.consignee_name ?? null,
      pieces_or_containers: dto.pieces_or_containers ?? null,
      weight_volume: dto.weight_volume ?? null,
      cargo_description: dto.cargo_description ?? null,
      master_bill_no: dto.master_bill_no ?? null,
      loading_place: dto.loading_place ?? null,
      departure_date: dto.departure_date ? new Date(dto.departure_date) : null,
      destination: dto.destination ?? null,
      arrival_date: dto.arrival_date ? new Date(dto.arrival_date) : null,
      final_destination: dto.final_destination ?? null,
      notes: dto.notes ?? null,
      subtotal: subtotal.toFixed(2),
      tax_total: taxTotal.toFixed(2),
      grand_total: grand.toFixed(2),
    });

    const saved = await qr.manager.save(invoice);

    // 6) Insert items
    for (const it of items) {
      const line_total = (it.quantity * it.unit_price).toFixed(2);
      await qr.manager.save(InvoiceItem, {
        invoice_id: saved.id,
        product_id: it.product_id,
        tax_id: it.tax_id ?? null,
        quantity: it.quantity,
        unit_price: it.unit_price.toFixed(2),
        line_total,
      });
    }

    // 7) Flip quotation flag (only if linked)
    if (quotation) {
      quotation.isInvoiceCreated = true;
      await qr.manager.save(quotation);
    }

    await qr.commitTransaction();

    const withRels = await this.invoiceRepo.findOne({
      where: { id: saved.id },
      relations: ["quotation", "customer", "category", "subcategories", "items"],
    });

    return ResponseHelper.success(withRels!, "Invoice created successfully", "Invoice", 201);
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }
}


  async update(dto: UpdateInvoiceDto): Promise<ApiResponse<Invoice>> {
    const base = await this.invoiceRepo.findOne({
      where: { id: dto.id },
      relations: ["quotation", "subcategories", "customer", "category"],
    });
    if (!base) throw new NotFoundException("Invoice not found");

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      if (dto.quotation_id !== undefined) {
        if (dto.quotation_id === null as any) (base as any).quotation = null;
        else {
          const q = await qr.manager.findOne(Quotation, { where: { id: dto.quotation_id! } });
          if (!q) throw new BadRequestException("Invalid quotation_id");
          (base as any).quotation = q;
        }
      }

      if (dto.customer_id) {
        const c = await qr.manager.findOne(Client, { where: { id: dto.customer_id } });
        if (!c) throw new BadRequestException("Invalid customer_id");
        (base as any).customer = c;
      }

      if (dto.job_file_id !== undefined) {
        if (dto.job_file_id === null as any) (base as any).category = null;
        else {
          const jf = await qr.manager.findOne(JobFile, { where: { id: dto.job_file_id! } });
          if (!jf) throw new BadRequestException("Invalid job_file_id");
          (base as any).category = jf;
        }
      }

      if (dto.subcategory_ids) {
        const subs = await qr.manager.findBy(Subcategory, { id: In(dto.subcategory_ids) });
        if (subs.length !== dto.subcategory_ids.length) {
          throw new BadRequestException("One or more subcategory_ids are invalid");
        }
        (base as any).subcategories = subs;
      }

      const set = <K extends keyof Invoice>(k: K, v: any) => {
        if (v !== undefined) (base as any)[k] = v;
      };
      set("valid_until", dto.valid_until ? new Date(dto.valid_until) : base.valid_until);
      set("shipper_name", dto.shipper_name ?? base.shipper_name);
      set("consignee_name", dto.consignee_name ?? base.consignee_name);
      set("pieces_or_containers", dto.pieces_or_containers ?? base.pieces_or_containers);
      set("weight_volume", dto.weight_volume ?? base.weight_volume);
      set("cargo_description", dto.cargo_description ?? base.cargo_description);
      set("master_bill_no", dto.master_bill_no ?? base.master_bill_no);
      set("loading_place", dto.loading_place ?? base.loading_place);
      set("departure_date", dto.departure_date ? new Date(dto.departure_date) : base.departure_date);
      set("destination", dto.destination ?? base.destination);
      set("arrival_date", dto.arrival_date ? new Date(dto.arrival_date) : base.arrival_date);
      set("final_destination", dto.final_destination ?? base.final_destination);
      set("notes", dto.notes ?? base.notes);

      if (dto.items && dto.items.length) {
        await qr.manager.delete(InvoiceItem, { invoice_id: dto.id });

        let subtotal = 0;
        let taxTotal = 0;

        for (const it of dto.items) {
          const line = it.quantity * it.unit_price;
          subtotal += line;

          if (it.tax_id) {
            const row = await qr.manager.query(`SELECT value FROM taxes WHERE id = $1`, [it.tax_id]);
            const p = Number(row?.[0]?.value ?? 0);
            taxTotal += line * (p / 100);
          }

          await qr.manager.save(InvoiceItem, {
            invoice_id: dto.id,
            product_id: it.product_id,
            tax_id: it.tax_id ?? null,
            quantity: it.quantity,
            unit_price: it.unit_price.toFixed(2),
            line_total: line.toFixed(2),
          });
        }

        base.subtotal = subtotal.toFixed(2);
        base.tax_total = taxTotal.toFixed(2);
        base.grand_total = (subtotal + taxTotal).toFixed(2);
      }

      const saved = await qr.manager.save(base);
      await qr.commitTransaction();

      const withRels = await this.invoiceRepo.findOne({
        where: { id: saved.id },
      relations: ["quotation", "customer", "category", "subcategories", "items"],
      });

      return ResponseHelper.success(withRels!, "Invoice updated successfully", "Invoice", 200);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async getById(id: string): Promise<ApiResponse<Invoice & { items: InvoiceItem[] }>> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ["quotation", "customer", "category", "subcategories"],
    });
    if (!invoice) throw new NotFoundException("Invoice not found");

    const items = await this.itemRepo.find({ where: { invoice_id: id } });
    return ResponseHelper.success(
      { ...(invoice as any), items },
      "Invoice retrieved successfully",
      "Invoice",
      200
    );
  }

  async getAll(p: InvoiceListQueryDto): Promise<PaginatedApiResponse<Invoice>> {
    const page = p.page ?? 1;
    const limit = p.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.invoiceRepo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.quotation", "quotation")
      .leftJoinAndSelect("i.customer", "customer")
      .leftJoinAndSelect("i.category", "job_file")
      .leftJoinAndSelect("i.subcategories", "sub")
      .orderBy("i.created_at", "DESC")
      .distinct(true)
      .skip(skip)
      .take(limit);

    if (p.search && p.search.length > 0) {
      const term = `%${p.search}%`;
      qb.andWhere(
        `(
          i.invoice_number ILIKE :term OR
          i.shipper_name ILIKE :term OR
          i.consignee_name ILIKE :term OR
          i.master_bill_no ILIKE :term OR
          i.destination ILIKE :term OR
          customer.name ILIKE :term OR
          customer.email ILIKE :term OR
          job_file.title ILIKE :term OR
          sub.title ILIKE :term
        )`,
        { term }
      );
    }

    const [rows, total] = await qb.getManyAndCount();

    return ResponseHelper.paginated(
      rows,
      page,
      limit,
      total,
      "invoices",
      "Invoices retrieved successfully",
      "Invoice"
    );
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const inv = await this.invoiceRepo.findOne({ where: { id } });
    if (!inv) throw new NotFoundException("Invoice not found");

    await this.invoiceRepo.remove(inv); // CASCADE deletes items
    return ResponseHelper.success(null, "Invoice deleted successfully", "Invoice", 200);
  }
}
