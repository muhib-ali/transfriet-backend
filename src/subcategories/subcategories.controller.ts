import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { SubcategoriesService } from "./subcategories.service";
import { SubcategoryResponseDto, SubcategoriesListResponseDto } from "./dto/subcategory-response.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("Subcategories")
@ApiBearerAuth("JWT-auth")
@Controller("subcategories")
export class SubcategoriesController {
  constructor(private subcategoriesService: SubcategoriesService) {}

//   @Post("create")
//   @ApiOperation({ summary: "Create new subcategory" })
//   @ApiResponse({ status: 201, description: "Subcategory created successfully", type: SubcategoryResponseDto })
//   @ApiResponse({ status: 400, description: "Bad Request - title already exists" })
//   @ApiBody({ type: CreateSubcategoryDto })
//   async create(@Body(ValidationPipe) dto: CreateSubcategoryDto) {
//     return this.subcategoriesService.create(dto);
//   }

//   @Put("update")
//   @ApiOperation({ summary: "Update subcategory" })
//   @ApiResponse({ status: 200, description: "Subcategory updated successfully", type: SubcategoryResponseDto })
//   @ApiResponse({ status: 404, description: "Subcategory not found" })
//   @ApiBody({ type: UpdateSubcategoryDto })
//   async update(@Body(ValidationPipe) dto: UpdateSubcategoryDto) {
//     return this.subcategoriesService.update(dto);
//   }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get subcategory by ID" })
  @ApiResponse({ status: 200, description: "Subcategory retrieved successfully", type: SubcategoryResponseDto })
  @ApiResponse({ status: 404, description: "Subcategory not found" })
  @ApiParam({ name: "id", description: "Subcategory ID", type: "string" })
  async getById(@Param("id") id: string) {
    return this.subcategoriesService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all subcategories with pagination" })
  @ApiResponse({ status: 200, description: "Subcategories retrieved successfully", type: SubcategoriesListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page" })
  async getAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    return this.subcategoriesService.getAll(paginationDto);
  }

//   @Delete("delete")
//   @ApiOperation({ summary: "Delete subcategory" })
//   @ApiResponse({ status: 200, description: "Subcategory deleted successfully" })
//   @ApiResponse({ status: 404, description: "Subcategory not found" })
//   @ApiBody({ type: DeleteSubcategoryDto })
//   async delete(@Body(ValidationPipe) dto: DeleteSubcategoryDto) {
//     return this.subcategoriesService.delete(dto);
//   }
}
