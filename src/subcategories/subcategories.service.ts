import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subcategory } from "../entities/subcategory.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class SubcategoriesService {
  constructor(@InjectRepository(Subcategory) private repo: Repository<Subcategory>) {}


  async getById(id: string): Promise<ApiResponse<Subcategory>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Subcategory not found");
    return ResponseHelper.success(entity, "Subcategory retrieved successfully", "Subcategory", 200);
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginatedApiResponse<Subcategory>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      skip, take: limit, order: { created_at: "DESC" },
    });

    return ResponseHelper.paginated(
      items, page, limit, total, "subcategories",
      "Subcategories retrieved successfully", "Subcategory"
    );
  }

 
}
