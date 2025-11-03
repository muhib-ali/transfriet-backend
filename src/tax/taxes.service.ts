import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tax } from "../entities/tax.entity";
import { CreateTaxDto } from "./dto/create-tax.dto";
import { UpdateTaxDto } from "./dto/update-tax.dto";
import { DeleteTaxDto } from "./dto/delete-tax.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

function clampPercent(v: number): number {
  const n = Number(Number(v).toFixed(2));
  if (Number.isNaN(n)) throw new BadRequestException("Invalid tax value");
  if (n < 0 || n > 100) throw new BadRequestException("Tax value must be between 0 and 100");
  return n;
}

@Injectable()
export class TaxesService {
  constructor(@InjectRepository(Tax) private taxRepo: Repository<Tax>) {}

  async create(dto: CreateTaxDto): Promise<ApiResponse<Tax>> {
    const { title, slug } = dto;
    const value = clampPercent(dto.value);
    const exists = await this.taxRepo.findOne({ where: { slug } });
    if (exists) throw new BadRequestException("Tax with this slug already exists");
    const entity = this.taxRepo.create({ title: title.trim(), slug: slug.trim(), value });
    const saved = await this.taxRepo.save(entity);
    return ResponseHelper.success(saved, "Tax created successfully", "Tax", 201);
  }

  async update(dto: UpdateTaxDto): Promise<ApiResponse<Tax>> {
    const { id, title, slug } = dto;
    const value = clampPercent(dto.value);
    const current = await this.taxRepo.findOne({ where: { id } });
    if (!current) throw new NotFoundException("Tax not found");
    const conflict = await this.taxRepo.findOne({ where: { slug } });
    if (conflict && conflict.id !== id) throw new BadRequestException("Tax with this slug already exists");
    await this.taxRepo.update(id, { title: title.trim(), slug: slug.trim(), value });
    const updated = await this.taxRepo.findOne({ where: { id } });
    return ResponseHelper.success(updated!, "Tax updated successfully", "Tax", 200);
  }

  async getById(id: string): Promise<ApiResponse<Tax>> {
    const tax = await this.taxRepo.findOne({ where: { id } });
    if (!tax) throw new NotFoundException("Tax not found");
    return ResponseHelper.success(tax, "Tax retrieved successfully", "Tax", 200);
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginatedApiResponse<Tax>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const [items, total] = await this.taxRepo.findAndCount({ skip, take: limit, order: { created_at: "DESC" } });
    return ResponseHelper.paginated(items, page, limit, total, "taxes", "Taxes retrieved successfully", "Tax");
  }

  async delete(dto: DeleteTaxDto): Promise<ApiResponse<null>> {
    const current = await this.taxRepo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Tax not found");
    await this.taxRepo.remove(current);
    return ResponseHelper.success(null, "Tax deleted successfully", "Tax", 200);
  }
}
