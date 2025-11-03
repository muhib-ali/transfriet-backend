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
  CategoriesDropdownResponseDto,
  SubcategoriesDropdownResponseDto,
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

  @Get("getAllCategories")
  @ApiOperation({ summary: "Get all active categories for dropdown" })
  @ApiResponse({ status: 200, type: CategoriesDropdownResponseDto })
  async getAllCategories() {
    return this.dropdownsService.getAllCategories();
  }

  @Get("getAllSubcategories")
  @ApiOperation({ summary: "Get all active subcategories for dropdown" })
  @ApiResponse({ status: 200, type: SubcategoriesDropdownResponseDto })
  async getAllSubcategories() {
    return this.dropdownsService.getAllSubcategories();
  }
}
