import {
  Controller, Post, Put, Get, Delete,
  Body, Param, Query, ValidationPipe
} from "@nestjs/common";
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery
} from "@nestjs/swagger";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { DeleteInvoiceDto } from "./dto/delete-invoice.dto";
import { InvoiceResponseDto, InvoicesListResponseDto } from "./dto/invoice-response.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { InvoiceListQueryDto } from "./dto/invoice-list-query.dto";

@ApiTags("Invoices")
@ApiBearerAuth("JWT-auth")
@Controller("invoices")
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new invoice" })
  @ApiResponse({ status: 201, type: InvoiceResponseDto })
  @ApiBody({ type: CreateInvoiceDto })
  async create(@Body(ValidationPipe) dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update invoice" })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  @ApiBody({ type: UpdateInvoiceDto })
  async update(@Body(ValidationPipe) dto: UpdateInvoiceDto) {
    return this.invoicesService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get invoice by ID" })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  @ApiParam({ name: "id", type: "string" })
  async getById(@Param("id") id: string) {
    return this.invoicesService.getById(id);
  }

  @Get("getAll")
  @ApiOperation({ summary: "Get all invoices (paginated)" })
  @ApiResponse({ status: 200, type: InvoicesListResponseDto })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  async getAll(@Query(ValidationPipe) pagination: InvoiceListQueryDto) {
    return this.invoicesService.getAll(pagination);
  }

  @Delete("delete")
  @ApiOperation({ summary: "Delete invoice" })
  @ApiResponse({
    status: 200,
    schema: { example: { statusCode: 200, status: true, message: "Invoice deleted successfully", heading: "Invoice", data: null } }
  })
  @ApiBody({ type: DeleteInvoiceDto })
  async delete(@Body(ValidationPipe) dto: DeleteInvoiceDto) {
    return this.invoicesService.delete(dto.id);
  }
}
