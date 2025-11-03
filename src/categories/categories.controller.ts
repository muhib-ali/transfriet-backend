import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DeleteCategoryDto } from "./dto/delete-category.dto";
import { CategoryResponseDto, CategoriesListResponseDto } from "./dto/category-response.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("Categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({ status: 201, description: "Category created successfully", type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: "Bad Request - title already exists" })
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body(ValidationPipe) dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update category" })
  @ApiResponse({ status: 200, description: "Category updated successfully", type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBody({ type: UpdateCategoryDto })
  async update(@Body(ValidationPipe) dto: UpdateCategoryDto) {
    return this.categoriesService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Category retrieved successfully", type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiParam({ name: "id", description: "Category ID", type: "string" })
  async getById(@Param("id") id: string) {
    return this.categoriesService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all categories with pagination" })
  @ApiResponse({ status: 200, description: "Categories retrieved successfully", type: CategoriesListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page" })
  async getAll(@Query(ValidationPipe) paginationDto: PaginationDto) {
    return this.categoriesService.getAll(paginationDto);
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBody({ type: DeleteCategoryDto })
  async delete(@Body(ValidationPipe) dto: DeleteCategoryDto) {
    return this.categoriesService.delete(dto);
  }
}
