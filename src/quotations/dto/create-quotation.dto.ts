import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString
} from "class-validator";
import { Type } from "class-transformer";

export class CreateQuotationItemDto {
  @IsUUID() product_id: string;
  @IsOptional() @IsUUID() tax_id?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unit_price: number;
}

export class CreateQuotationDto {
  @IsOptional() @IsDateString() valid_until?: string;

  @IsUUID() customer_id: string;
  @IsOptional() @IsUUID() category_id?: string;

  // ✅ multiple subcategories
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  subcategory_ids?: string[];

  @IsOptional() @IsString() shipper_name?: string;
  @IsOptional() @IsString() consignee_name?: string;
  @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number;
  @IsOptional() @IsString() weight_volume?: string;
  @IsOptional() @IsString() cargo_description?: string;
  @IsOptional() @IsString() loading_place?: string;
  @IsOptional() @IsDateString() departure_date?: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsDateString() arrival_date?: string;
  @IsOptional() @IsString() final_destination?: string;
  @IsOptional() @IsString() notes?: string;

  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];
}
