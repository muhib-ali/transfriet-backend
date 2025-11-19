import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import { Product } from "../entities/product.entity";
import { ProductTranslation } from "../entities/product-translation.entity";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { ProductListQueryDto } from "./dto/product-list-query.dto";

import { ResponseHelper } from "../common/helpers/response.helper";
import {
  ApiResponse,
  PaginatedApiResponse,
} from "../common/interfaces/api-response.interface";
import { ProductDto } from "./dto/product-response.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,

    @InjectRepository(ProductTranslation)
    private translationRepo: Repository<ProductTranslation>,
  ) {}

  private mapProductToDto(product: Product): ProductDto {
    const translations: Record<
      string,
      { title: string; description: string | null }
    > = {};

    if (product.translations) {
      for (const t of product.translations) {
        translations[t.language_code] = {
          title: t.title,
          description: t.description,
        };
      }
    }

    return {
      id: product.id,
      price: product.price,
      category_id: product.job_file_id ?? null,
      translations,
      is_active: product.is_active,
      created_by: product.created_by,
      updated_by: product.updated_by,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  async create(dto: CreateProductDto): Promise<ApiResponse<ProductDto>> {
    const product = this.repo.create({
      price: dto.price,
      job_file_id: dto.job_file_id ?? null,
    });

    const savedProduct = await this.repo.save(product);

    const translationsEntities = dto.translations.map((t) =>
      this.translationRepo.create({
        language_code: t.language_code,
        title: t.title.trim(),
        description: t.description?.trim() ?? null,
        product: savedProduct,
      }),
    );

    await this.translationRepo.save(translationsEntities);

    const withRelations = await this.repo.findOne({
      where: { id: savedProduct.id },
      relations: ["translations", "category"],
    });

    const data = this.mapProductToDto(withRelations!);

    return ResponseHelper.success(
      data,
      "Product created successfully",
      "Product",
      201,
    );
  }

  async update(dto: UpdateProductDto): Promise<ApiResponse<ProductDto>> {
    const current = await this.repo.findOne({
      where: { id: dto.id },
      relations: ["translations"],
    });
    if (!current) throw new NotFoundException("Product not found");

    if (dto.price !== undefined) {
      current.price = dto.price;
    }

    if (dto.job_file_id !== undefined) {
      current.job_file_id = dto.job_file_id;
    }

    await this.repo.save(current);

    if (dto.translations && dto.translations.length > 0) {
      await this.translationRepo.delete({ product: { id: current.id } as any });

      const newTranslations = dto.translations.map((t) =>
        this.translationRepo.create({
          language_code: t.language_code,
          title: t.title.trim(),
          description: t.description?.trim() ?? null,
          product: current,
        }),
      );

      await this.translationRepo.save(newTranslations);
    }

    const updated = await this.repo.findOne({
      where: { id: dto.id },
      relations: ["translations", "category"],
    });

    const data = this.mapProductToDto(updated!);

    return ResponseHelper.success(
      data,
      "Product updated successfully",
      "Product",
      200,
    );
  }

  async getById(id: string): Promise<ApiResponse<ProductDto>> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ["translations", "category"],
    });
    if (!entity) throw new NotFoundException("Product not found");

    const data = this.mapProductToDto(entity);

    return ResponseHelper.success(
      data,
      "Product retrieved successfully",
      "Product",
      200,
    );
  }

  async getAll(
    query: ProductListQueryDto,
  ): Promise<PaginatedApiResponse<ProductDto>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "job_file")
      .leftJoinAndSelect("product.translations", "translation")
      .orderBy("product.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where("translation.title ILIKE :search", { search: term })
            .orWhere("translation.description ILIKE :search", { search: term })
            .orWhere("job_file.title ILIKE :search", { search: term })
            .orWhere("job_file.description ILIKE :search", {
              search: term,
            });
        }),
      );
    }

    const [items, total] = await qb.getManyAndCount();
    const mapped = items.map((p) => this.mapProductToDto(p));

    return ResponseHelper.paginated(
      mapped,
      page,
      limit,
      total,
      "products",
      "Products retrieved successfully",
      "Product",
    );
  }

  async delete(dto: DeleteProductDto): Promise<ApiResponse<null>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Product not found");
    await this.repo.remove(current);
    return ResponseHelper.success(
      null,
      "Product deleted successfully",
      "Product",
      200,
    );
  }
}
