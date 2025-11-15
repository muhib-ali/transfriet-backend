import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobFile } from "../entities/job-file.entity";
import { CreateJobFileDto } from "./dto/create-job-file.dto";
import { UpdateJobFileDto } from "./dto/update-job-file.dto";
import { DeleteJobFileDto } from "./dto/delete-job-file.dto";
import { JobFileListQueryDto } from "./dto/job-file-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class JobFilesService {
  constructor(@InjectRepository(JobFile) private repo: Repository<JobFile>) {}

  async create(dto: CreateJobFileDto): Promise<ApiResponse<JobFile>> {
    const title = dto.title.trim();
    const conflict = await this.repo.findOne({ where: { title } });
    if (conflict) throw new BadRequestException("Category with this title already exists");

    const entity = this.repo.create({
      title,
      description: dto.description?.trim() ?? null,
    });
    const saved = await this.repo.save(entity);
    return ResponseHelper.success(saved, "Job file created successfully", "Job File", 201);
  }

  async update(dto: UpdateJobFileDto): Promise<ApiResponse<JobFile>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Category not found");

    const title = dto.title.trim();
    const conflict = await this.repo.findOne({ where: { title } });
    if (conflict && conflict.id !== dto.id) {
      throw new BadRequestException("Job file with this title already exists");
    }

    await this.repo.update(dto.id, {
      title,
      description: dto.description?.trim() ?? null,
    });
    const updated = await this.repo.findOne({ where: { id: dto.id } });
    return ResponseHelper.success(updated!, "Job file updated successfully", "Job File", 200);
  }

  async getById(id: string): Promise<ApiResponse<JobFile>> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Job file not found");
    return ResponseHelper.success(entity, "Job file retrieved successfully", "Job File", 200);
  }

  async getAll(query: JobFileListQueryDto): Promise<PaginatedApiResponse<JobFile>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder("job_file")
      .orderBy("job_file.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.where("job_file.title ILIKE :search", { search: term })
        .orWhere("job_file.description ILIKE :search", { search: term });
    }

    const [items, total] = await qb.getManyAndCount();

    return ResponseHelper.paginated(
      items, page, limit, total, "job_files",
      "Job files retrieved successfully", "Job File"
    );
  }

  async delete(dto: DeleteJobFileDto): Promise<ApiResponse<null>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Job file not found");

    // Products FK is ON DELETE SET NULL (recommended). If not, consider adding that FK behavior in migration.
    await this.repo.remove(current);
    return ResponseHelper.success(null, "Job file deleted successfully", "Job File", 200);
  }
}
