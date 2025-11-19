import { ApiProperty } from "@nestjs/swagger";

export class DropdownItemDto {
  @ApiProperty({
    description: "Display label for dropdown (e.g. English title)",
    example: "Iron",
  })
  label: string;

  @ApiProperty({
    description: "Optional secondary label (e.g. Arabic title for multi-language dropdowns)",
    example: "مكواة",
    required: false,
  })
  labelAr?: string;

  @ApiProperty({
    description: "Value for dropdown item",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  value: string;

  @ApiProperty({
    description: "Raw numeric price (only for products dropdown)",
    example: 489999.99,
    required: false,
  })
  price?: number;
}

export class RolesDropdownDataDto {
  @ApiProperty({
    type: [DropdownItemDto],
    description: "Array of roles for dropdown",
  })
  rolesDropdown: DropdownItemDto[];
}

export class ModulesDropdownDataDto {
  @ApiProperty({
    type: [DropdownItemDto],
    description: "Array of modules for dropdown",
  })
  modulesDropdown: DropdownItemDto[];
}

export class ProductsDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of products for dropdown" })
  productsDropdown: DropdownItemDto[];
}

export class TaxesDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of taxes for dropdown" })
  taxesDropdown: DropdownItemDto[];
}

export class ClientsDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of clients for dropdown" })
  clientsDropdown: DropdownItemDto[];
}

export class JobFilesDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of job files for dropdown" })
  jobFilesDropdown: DropdownItemDto[];
}

export class ServiceDetailsDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of service details for dropdown" })
  serviceDetailsDropdown: DropdownItemDto[];
}


//---------------------
export class RolesDropdownResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: "Roles dropdown data retrieved successfully" })
  message: string;

  @ApiProperty({ example: "Dropdowns" })
  heading: string;

  @ApiProperty({ type: RolesDropdownDataDto })
  data: RolesDropdownDataDto;
}

export class ModulesDropdownResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: "Modules dropdown data retrieved successfully" })
  message: string;

  @ApiProperty({ example: "Dropdowns" })
  heading: string;

  @ApiProperty({ type: ModulesDropdownDataDto })
  data: ModulesDropdownDataDto;
}
//--------------------
export class ProductsDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Products dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: ProductsDropdownDataDto }) data: ProductsDropdownDataDto;
}

export class TaxesDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Taxes dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: TaxesDropdownDataDto }) data: TaxesDropdownDataDto;
}

export class ClientsDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Clients dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: ClientsDropdownDataDto }) data: ClientsDropdownDataDto;
}

export class JobFilesDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Job files dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: JobFilesDropdownDataDto }) data: JobFilesDropdownDataDto;
}

export class ServiceDetailsDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Service details dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: ServiceDetailsDropdownDataDto }) data: ServiceDetailsDropdownDataDto;
}