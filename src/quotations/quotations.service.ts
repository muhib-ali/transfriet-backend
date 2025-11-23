import {
  Injectable, BadRequestException, NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { Quotation } from "../entities/quotation.entity";
import { QuotationItem } from "../entities/quotation-item.entity";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { UpdateQuotationDto } from "./dto/update-quotation.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { QuotationListQueryDto } from "./dto/quotation-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";
import { Client } from "../entities/client.entity";
import { JobFile } from "../entities/job-file.entity";
import { ServiceDetail } from "../entities/service-detail.entity";
import { Tax } from "../entities/tax.entity";
import { QuoteCounter } from "../entities/quote-counter.entity";

@Injectable()
export class QuotationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Quotation) private quotationRepo: Repository<Quotation>,
    @InjectRepository(QuotationItem) private itemRepo: Repository<QuotationItem>,
    @InjectRepository(ServiceDetail) private subRepo: Repository<ServiceDetail>,
  ) {}

  private async nextQuoteNumber(qr: ReturnType<DataSource["createQueryRunner"]>): Promise<string> {
    const year = new Date().getFullYear();
    const rows = await qr.manager.query(
      `
      INSERT INTO quote_counters("year","last_serial","updated_at")
      VALUES ($1, 1, now())
      ON CONFLICT("year")
      DO UPDATE SET last_serial = quote_counters.last_serial + 1, updated_at = now()
      RETURNING last_serial;
      `,
      [year]
    );
    const serial = Number(rows[0].last_serial);
    const padded = String(serial).padStart(3, "0");
    return `QUO-${year}-${padded}`;
  }

  async create(dto: CreateQuotationDto): Promise<ApiResponse<Quotation>> {
    if (!dto.items?.length) throw new BadRequestException("At least one item is required");

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Validate foreigns (existence)
      const customer = await qr.manager.findOne(Client, { where: { id: dto.customer_id } });
      if (!customer) throw new BadRequestException("Invalid customer_id");

      let jobFile: JobFile | null = null;
      if (dto.job_file_id) {
        jobFile = await qr.manager.findOne(JobFile, { where: { id: dto.job_file_id } });
        if (!jobFile) throw new BadRequestException("Invalid job_file_id");
      }

      let serviceDetails: ServiceDetail[] = [];
      if (dto.service_detail_ids?.length) {
        serviceDetails = await qr.manager.findBy(ServiceDetail, { id: In(dto.service_detail_ids) });
        if (serviceDetails.length !== dto.service_detail_ids.length) {
          throw new BadRequestException("One or more service_detail_ids are invalid");
        }
      }

      const quote_number = await this.nextQuoteNumber(qr);

      // totals
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
      }
      const grand = subtotal + taxTotal;

      // Create quotation with relations
      const quotation = qr.manager.create(Quotation, {
        quote_number,
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        customer,                 // relation object
        category: jobFile ?? null,
        service_details: serviceDetails,            // many-to-many
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
        notes_en: dto.notes_en ?? null,
        notes_ar: dto.notes_ar ?? null,
        subtotal: subtotal.toFixed(2),
        tax_total: taxTotal.toFixed(2),
        grand_total: grand.toFixed(2),
      });

      const saved = await qr.manager.save(quotation);

      // Items
      for (const it of dto.items) {
        const line_total = (it.quantity * it.unit_price).toFixed(2);
        const item = qr.manager.create(QuotationItem, {
          quotation_id: saved.id,
          product_id: it.product_id,
          tax_id: it.tax_id ?? null,
          quantity: it.quantity,
          unit_price: it.unit_price.toFixed(2),
          line_total,
        });
        await qr.manager.save(item);
      }

      await qr.commitTransaction();

      const withRels = await this.quotationRepo.findOne({
        where: { id: saved.id },
        relations: ["customer", "category", "service_details", "items"],
      });

      return ResponseHelper.success(withRels!, "Quotation created successfully", "Quotation", 201);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async update(dto: UpdateQuotationDto): Promise<ApiResponse<Quotation>> {
    const base = await this.quotationRepo.findOne({
      where: { id: dto.id },
      relations: ["service_details", "customer", "category"],
    });
    if (!base) throw new NotFoundException("Quotation not found");

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // patch relations
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

      if (dto.service_detail_ids) {
        const subs = await qr.manager.findBy(ServiceDetail, { id: In(dto.service_detail_ids) });
        if (subs.length !== dto.service_detail_ids.length) {
          throw new BadRequestException("One or more service_detail_ids are invalid");
        }
        (base as any).service_details = subs;
      }

      // patch scalars
      const set = <K extends keyof Quotation>(k: K, v: any) => {
        if (v !== undefined) (base as any)[k] = v;
      };
      set("valid_until", dto.valid_until ? new Date(dto.valid_until) : base.valid_until);
      set("shipper_name", dto.shipper_name ?? base.shipper_name);
      set("consignee_name", dto.consignee_name ?? base.consignee_name);
      set("pieces_or_containers", dto.pieces_or_containers ?? base.pieces_or_containers);
      set("weight_volume", dto.weight_volume ?? base.weight_volume);
      set("cargo_description", dto.cargo_description ?? base.cargo_description);
      set("loading_place", dto.loading_place ?? base.loading_place);
      set("master_bill_no", dto.master_bill_no ?? base.master_bill_no);
      set("departure_date", dto.departure_date ? new Date(dto.departure_date) : base.departure_date);
      set("destination", dto.destination ?? base.destination);
      set("arrival_date", dto.arrival_date ? new Date(dto.arrival_date) : base.arrival_date);
      set("final_destination", dto.final_destination ?? base.final_destination);
      set("notes_en", dto.notes_en ?? base.notes_en);
      set("notes_ar", dto.notes_ar ?? base.notes_ar);
      set("isInvoiceCreated", dto.isInvoiceCreated);

      // replace items if provided
      if (dto.items && dto.items.length) {
        await qr.manager.delete(QuotationItem, { quotation_id: dto.id });

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

          await qr.manager.save(QuotationItem, {
            quotation_id: dto.id,
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

      const withRels = await this.quotationRepo.findOne({
        where: { id: saved.id },
      relations: ["customer", "category", "service_details", "items"],
      });

      return ResponseHelper.success(withRels!, "Quotation updated successfully", "Quotation", 200);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async getById(id: string): Promise<ApiResponse<Quotation & { items: QuotationItem[] }>> {
    const quotation = await this.quotationRepo.findOne({
      where: { id },
      relations: ["customer", "category", "service_details"],
    });
    if (!quotation) throw new NotFoundException("Quotation not found");

    const items = await this.itemRepo.find({ where: { quotation_id: id } });
    return ResponseHelper.success(
      { ...(quotation as any), items },
      "Quotation retrieved successfully",
      "Quotation",
      200
    );
  }

  async getAll(p: QuotationListQueryDto): Promise<PaginatedApiResponse<Quotation>> {
    const page = p.page ?? 1;
    const limit = p.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.quotationRepo
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.customer", "customer")
      .leftJoinAndSelect("q.category", "job_file")
      .leftJoinAndSelect("q.service_details", "sub")
      .orderBy("q.created_at", "DESC")
      .distinct(true)
      .skip(skip)
      .take(limit);

    if (p.search && p.search.length > 0) {
      const term = `%${p.search}%`;
      qb.andWhere(
        `(
          q.quote_number ILIKE :term OR
          q.shipper_name ILIKE :term OR
          q.consignee_name ILIKE :term OR
          q.master_bill_no ILIKE :term OR
          q.destination ILIKE :term OR
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
      "quotations",
      "Quotations retrieved successfully",
      "Quotation"
    );
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const q = await this.quotationRepo.findOne({ where: { id } });
    if (!q) throw new NotFoundException("Quotation not found");

    await this.quotationRepo.remove(q); // CASCADE deletes items
    return ResponseHelper.success(null, "Quotation deleted successfully", "Quotation", 200);
  }
}
