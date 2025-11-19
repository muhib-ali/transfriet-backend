import { Controller, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DropdownsService } from "./dropdowns.service";
import {
  RolesDropdownResponseDto,
  ModulesDropdownResponseDto,
  ProductsDropdownResponseDto,
  TaxesDropdownResponseDto,
  ClientsDropdownResponseDto,
  JobFilesDropdownResponseDto,
  ServiceDetailsDropdownResponseDto,
} from "./dto/dropdown-response.dto";

@ApiTags("Dropdowns")
@ApiBearerAuth("JWT-auth")
@Controller("dropdowns")
export class DropdownsController {
  constructor(private dropdownsService: DropdownsService) {}

  @Get("getAllRoles")
  @ApiOperation({ summary: "Get all active roles for dropdown" })
  @ApiResponse({
    status: 200,
    description: "Roles dropdown data retrieved successfully",
    type: RolesDropdownResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllRoles() {
    return this.dropdownsService.getAllRoles();
  }

  @Get("getAllModules")
  @ApiOperation({ summary: "Get all active modules for dropdown" })
  @ApiResponse({
    status: 200,
    description: "Modules dropdown data retrieved successfully",
    type: ModulesDropdownResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllModules() {
    return this.dropdownsService.getAllModules();
  }


    @Get("getAllProducts")
  @ApiOperation({ summary: "Get all active products for dropdown" })
  @ApiResponse({ status: 200, type: ProductsDropdownResponseDto })
  async getAllProducts() {
    return this.dropdownsService.getAllProducts();
  }

  @Get("getAllTaxes")
  @ApiOperation({ summary: "Get all active taxes for dropdown" })
  @ApiResponse({ status: 200, type: TaxesDropdownResponseDto })
  async getAllTaxes() {
    return this.dropdownsService.getAllTaxes();
  }

  @Get("getAllClients")
  @ApiOperation({ summary: "Get all active clients for dropdown" })
  @ApiResponse({ status: 200, type: ClientsDropdownResponseDto })
  async getAllClients() {
    return this.dropdownsService.getAllClients();
  }

  @Get("getAllJobFiles")
  @ApiOperation({ summary: "Get all active job files for dropdown" })
  @ApiResponse({ status: 200, type: JobFilesDropdownResponseDto })
  async getAllJobFiles() {
    return this.dropdownsService.getAllJobFiles();
  }

  @Get("getAllServiceDetails")
  @ApiOperation({ summary: "Get all active service details for dropdown" })
  @ApiResponse({ status: 200, type: ServiceDetailsDropdownResponseDto })
  async getAllServiceDetails() {
    return this.dropdownsService.getAllServiceDetails();
  }
}
