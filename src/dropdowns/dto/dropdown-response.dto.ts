import { ApiProperty } from "@nestjs/swagger";

export class DropdownItemDto {
  @ApiProperty({
    description: "Display label for dropdown",
    example: "Platform Admin",
  })
  label: string;

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
  price?: number; // <--- added

 
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

export class CategoriesDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of categories for dropdown" })
  categoriesDropdown: DropdownItemDto[];
}

export class SubcategoriesDropdownDataDto {
  @ApiProperty({ type: [DropdownItemDto], description: "Array of subcategories for dropdown" })
  subcategoriesDropdown: DropdownItemDto[];
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

export class CategoriesDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Categories dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: CategoriesDropdownDataDto }) data: CategoriesDropdownDataDto;
}

export class SubcategoriesDropdownResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Subcategories dropdown data retrieved successfully" }) message: string;
  @ApiProperty({ example: "Dropdowns" }) heading: string;
  @ApiProperty({ type: SubcategoriesDropdownDataDto }) data: SubcategoriesDropdownDataDto;
}