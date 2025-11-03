import {
  Controller, Post, Put, Get, Delete,
  Body, Param, Query, ValidationPipe
} from "@nestjs/common";
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery
} from "@nestjs/swagger";
import { QuotationsService } from "./quotations.service";
import { CreateQuotationDto } from "./dto/create-quotation.dto";
import { UpdateQuotationDto } from "./dto/update-quotation.dto";
import { DeleteQuotationDto } from "./dto/delete-quotation.dto";
import { QuotationResponseDto, QuotationsListResponseDto } from "./dto/quotation-response.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("Quotations")
@ApiBearerAuth("JWT-auth")
@Controller("quotations")
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new quotation" })
  @ApiResponse({ status: 201, type: QuotationResponseDto })
  @ApiBody({ type: CreateQuotationDto })
  async create(@Body(ValidationPipe) dto: CreateQuotationDto) {
    return this.quotationsService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update quotation" })
  @ApiResponse({ status: 200, type: QuotationResponseDto })
  @ApiBody({ type: UpdateQuotationDto })
  async update(@Body(ValidationPipe) dto: UpdateQuotationDto) {
    return this.quotationsService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get quotation by ID" })
  @ApiResponse({ status: 200, type: QuotationResponseDto })
  @ApiParam({ name: "id", type: "string" })
  async getById(@Param("id") id: string) {
    return this.quotationsService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all quotations (paginated)" })
  @ApiResponse({ status: 200, type: QuotationsListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getAll(@Query(ValidationPipe) pagination: PaginationDto) {
    return this.quotationsService.getAll(pagination);
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete quotation" })
  @ApiResponse({
    status: 200,
    schema: { example: { statusCode: 200, status: true, message: "Quotation deleted successfully", heading: "Quotation", data: null } }
  })
  @ApiBody({ type: DeleteQuotationDto })
  async delete(@Body(ValidationPipe) dto: DeleteQuotationDto) {
    return this.quotationsService.delete(dto.id);
  }
}
