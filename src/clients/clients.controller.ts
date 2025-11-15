import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery,
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DeleteClientDto } from "./dto/delete-client.dto";
import { ClientResponseDto, ClientsListResponseDto } from "./dto/client-response.dto";
import { ClientListQueryDto } from "./dto/client-list-query.dto";

@ApiTags("Clients")
@ApiBearerAuth("JWT-auth")
@Controller("clients")
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post("create")
  @ApiOperation({ summary: "Create new client" })
  @ApiResponse({ status: 201, description: "Client created successfully", type: ClientResponseDto })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Client with email already exists",
    schema: { example: { statusCode: 400, status: false, message: "Client with this email already exists", heading: "Client", data: null } },
  })
  @ApiBody({ type: CreateClientDto })
  async create(@Body(ValidationPipe) dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Put("update")
  @ApiOperation({ summary: "Update client" })
  @ApiResponse({ status: 200, description: "Client updated successfully", type: ClientResponseDto })
  @ApiResponse({
    status: 404,
    description: "Client not found",
    schema: { example: { statusCode: 404, status: false, message: "Client not found", heading: "Client", data: null } },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Client with email already exists",
    schema: { example: { statusCode: 400, status: false, message: "Client with this email already exists", heading: "Client", data: null } },
  })
  @ApiBody({ type: UpdateClientDto })
  async update(@Body(ValidationPipe) dto: UpdateClientDto) {
    return this.clientsService.update(dto);
  }

  @Get("getById/:id")
  @ApiOperation({ summary: "Get client by ID" })
  @ApiResponse({ status: 200, description: "Client retrieved successfully", type: ClientResponseDto })
  @ApiResponse({
    status: 404,
    description: "Client not found",
    schema: { example: { statusCode: 404, status: false, message: "Client not found", heading: "Client", data: null } },
  })
  @ApiParam({ name: "id", description: "Client ID", type: "string" })
  async getById(@Param("id") id: string) {
    return this.clientsService.getById(id);
  }

@Get("getAll")
@ApiOperation({ summary: "Get all clients with pagination" })
@ApiResponse({ status: 200, description: "Clients retrieved successfully", type: ClientsListResponseDto })
@ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
@ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page" })
@ApiQuery({ name: "search", required: false, type: String, description: "Optional search term" })
async getAll(@Query(ValidationPipe) query: ClientListQueryDto) {
  return this.clientsService.getAll(query);
}

  @Delete("delete")
  @ApiOperation({ summary: "Delete client" })
  @ApiResponse({
    status: 200,
    description: "Client deleted successfully",
    schema: { example: { statusCode: 200, status: true, message: "Client deleted successfully", heading: "Client", data: null } },
  })
  @ApiResponse({
    status: 404,
    description: "Client not found",
    schema: { example: { statusCode: 404, status: false, message: "Client not found", heading: "Client", data: null } },
  })
  @ApiBody({ type: DeleteClientDto })
  async delete(@Body(ValidationPipe) dto: DeleteClientDto) {
    return this.clientsService.delete(dto);
  }
}
