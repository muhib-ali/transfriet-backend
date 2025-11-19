import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceDetail } from "../entities/service-detail.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class ServiceDetailsService {
  constructor(@InjectRepository(ServiceDetail) private repo: Repository<ServiceDetail>) {}


  async getById(id: string): Promise<ApiResponse<ServiceDetail>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Service detail not found");
    return ResponseHelper.success(entity, "Service detail retrieved successfully", "Service Detail", 200);
  }

  async getAll(paginationDto: PaginationDto): Promise<PaginatedApiResponse<ServiceDetail>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      skip, take: limit, order: { created_at: "DESC" },
    });

    return ResponseHelper.paginated(
      items, page, limit, total, "service_details",
      "Service details retrieved successfully", "Service Detail"
    );
  }

 
}
