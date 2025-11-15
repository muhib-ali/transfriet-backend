import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DeleteProductDto } from "./dto/delete-product.dto";
import { ProductResponseDto, ProductsListResponseDto } from "./dto/product-response.dto";
import { ProductListQueryDto } from "./dto/product-list-query.dto";

@ApiTags("Products")
@ApiBearerAuth("JWT-auth")
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({ status: 201, description: "Product created successfully", type: ProductResponseDto })
  @ApiResponse({ status: 400, description: "Bad Request - title already exists" })
  @ApiBody({ type: CreateProductDto })
  async create(@Body(ValidationPipe) dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update product" })
  @ApiResponse({ status: 200, description: "Product updated successfully", type: ProductResponseDto })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 400, description: "Bad Request - title already exists" })
  @ApiBody({ type: UpdateProductDto })
  async update(@Body(ValidationPipe) dto: UpdateProductDto) {
    return this.productsService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, description: "Product retrieved successfully", type: ProductResponseDto })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiParam({ name: "id", description: "Product ID", type: "string" })
  async getById(@Param("id") id: string) {
    return this.productsService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all products with pagination" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully", type: ProductsListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Optional search term" })
  async getAll(@Query(ValidationPipe) query: ProductListQueryDto) {
    return this.productsService.getAll(query);
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete product" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiBody({ type: DeleteProductDto })
  async delete(@Body(ValidationPipe) dto: DeleteProductDto) {
    return this.productsService.delete(dto);
  }
}
