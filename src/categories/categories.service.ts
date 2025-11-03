import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DeleteCategoryDto } from "./dto/delete-category.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async create(dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
    const title = dto.title.trim();
    const conflict = await this.repo.findOne({ where: { title } });
    if (conflict) throw new BadRequestException("Category with this title already exists");

    const entity = this.repo.create({
      title,
      description: dto.description?.trim() ?? null,
    });
    const saved = await this.repo.save(entity);
    return ResponseHelper.success(saved, "Category created successfully", "Category", 201);
  }

  async update(dto: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Category not found");

    const title = dto.title.trim();
    const conflict = await this.repo.findOne({ where: { title } });
    if (conflict && conflict.id !== dto.id) {
      throw new BadRequestException("Category with this title already exists");
    }

    await this.repo.update(dto.id, {
      title,
      description: dto.description?.trim() ?? null,
    });
    const updated = await this.repo.findOne({ where: { id: dto.id } });
    return ResponseHelper.success(updated!, "Category updated successfully", "Category", 200);
  }

  async getById(id: string): Promise<ApiResponse<Category>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Category not found");
    return ResponseHelper.success(entity, "Category retrieved successfully", "Category", 200);
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginatedApiResponse<Category>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      skip, take: limit, order: { created_at: "DESC" },
    });

    return ResponseHelper.paginated(
      items, page, limit, total, "categories",
      "Categories retrieved successfully", "Category"
    );
  }

  async delete(dto: DeleteCategoryDto): Promise<ApiResponse<null>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Category not found");

    // Products FK is ON DELETE SET NULL (recommended). If not, consider adding that FK behavior in migration.
    await this.repo.remove(current);
    return ResponseHelper.success(null, "Category deleted successfully", "Category", 200);
  }
}
