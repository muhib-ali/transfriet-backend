import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { JobFilesService } from "./job_files.service";
import { CreateJobFileDto } from "./dto/create-job-file.dto";
import { UpdateJobFileDto } from "./dto/update-job-file.dto";
import { DeleteJobFileDto } from "./dto/delete-job-file.dto";
import { JobFileResponseDto, JobFilesListResponseDto } from "./dto/job-file-response.dto";
import { JobFileListQueryDto } from "./dto/job-file-list-query.dto";

@ApiTags("job_files")
@ApiBearerAuth("JWT-auth")
@Controller("job_files")
export class JobFilesController {
  constructor(private jobFilesService: JobFilesService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new job file" })
  @ApiResponse({ status: 201, description: "Job file created successfully", type: JobFileResponseDto })
  @ApiResponse({ status: 400, description: "Bad Request - title already exists" })
  @ApiBody({ type: CreateJobFileDto })
  async create(@Body(ValidationPipe) dto: CreateJobFileDto) {
    return this.jobFilesService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update job file" })
  @ApiResponse({ status: 200, description: "Job file updated successfully", type: JobFileResponseDto })
  @ApiResponse({ status: 404, description: "Job file not found" })
  @ApiBody({ type: UpdateJobFileDto })
  async update(@Body(ValidationPipe) dto: UpdateJobFileDto) {
    return this.jobFilesService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get job file by ID" })
  @ApiResponse({ status: 200, description: "Job file retrieved successfully", type: JobFileResponseDto })
  @ApiResponse({ status: 404, description: "Job file not found" })
  @ApiParam({ name: "id", description: "Job file ID", type: "string" })
  async getById(@Param("id") id: string) {
    return this.jobFilesService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all job files with pagination" })
  @ApiResponse({ status: 200, description: "Job files retrieved successfully", type: JobFilesListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Optional search term" })
  async getAll(@Query(ValidationPipe) query: JobFileListQueryDto) {
    return this.jobFilesService.getAll(query);
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete job file" })
  @ApiResponse({ status: 200, description: "Job file deleted successfully" })
  @ApiResponse({ status: 404, description: "Job file not found" })
  @ApiBody({ type: DeleteJobFileDto })
  async delete(@Body(ValidationPipe) dto: DeleteJobFileDto) {
    return this.jobFilesService.delete(dto);
  }
}
