import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { ProductListQueryDto } from "./dto/product-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async create(dto: CreateProductDto): Promise<ApiResponse<Product>> {
    const title = dto.title.trim();
    const byTitle = await this.repo.findOne({ where: { title } });
    if (byTitle) throw new BadRequestException("Product with this title already exists");

    const entity = this.repo.create({
      title: dto.title.trim(),
      description: dto.description?.trim() ?? null,
      price: dto.price,
      job_file_id: dto.job_file_id ?? null,
    });
    const saved = await this.repo.save(entity);
    return ResponseHelper.success(saved, "Product created successfully", "Product", 201);
  }

  async update(dto: UpdateProductDto): Promise<ApiResponse<Product>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Product not found");

    const title = dto.title.trim();
    const conflictTitle = await this.repo.findOne({ where: { title } });
    if (conflictTitle && conflictTitle.id !== dto.id) {
      throw new BadRequestException("Product with this title already exists");
    }

    await this.repo.update(dto.id, {
      title: dto.title.trim(),
      description: dto.description?.trim() ?? null,
      price: dto.price,
      job_file_id: dto.job_file_id ?? null,
    });
    const updated = await this.repo.findOne({ where: { id: dto.id } });
    return ResponseHelper.success(updated!, "Product updated successfully", "Product", 200);
  }

  async getById(id: string): Promise<ApiResponse<Product>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Product not found");
    return ResponseHelper.success(entity, "Product retrieved successfully", "Product", 200);
  }

  async getAll(query: ProductListQueryDto): Promise<PaginatedApiResponse<Product>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "job_file")
      .orderBy("product.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.andWhere(new Brackets((sub) => {
        sub.where("product.title ILIKE :search", { search: term })
          .orWhere("product.description ILIKE :search", { search: term })
          .orWhere("job_file.title ILIKE :search", { search: term })
          .orWhere("job_file.description ILIKE :search", { search: term });
      }));
    }

    const [items, total] = await qb.getManyAndCount();

    return ResponseHelper.paginated(
      items, page, limit, total, "products",
      "Products retrieved successfully", "Product"
    );
  }

  async delete(dto: DeleteProductDto): Promise<ApiResponse<null>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Product not found");
    await this.repo.remove(current);
    return ResponseHelper.success(null, "Product deleted successfully", "Product", 200);
  }
}
