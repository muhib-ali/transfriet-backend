import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString, IsBoolean
} from "class-validator";
import { Type } from "class-transformer";

class UpdateQuotationItemDto {
  @IsUUID() product_id: string;
  @IsOptional() @IsUUID() tax_id?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unit_price: number;
}

export class UpdateQuotationDto {
  @IsUUID() id: string;

  @IsOptional() @IsDateString() valid_until?: string | null;
  @IsOptional() @IsUUID() customer_id?: string;
  @IsOptional() @IsUUID() category_id?: string | null;

  // ✅ multi
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  subcategory_ids?: string[] | null;

  @IsOptional() @IsString() shipper_name?: string | null;
  @IsOptional() @IsString() consignee_name?: string | null;
  @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number | null;
  @IsOptional() @IsString() weight_volume?: string | null;
  @IsOptional() @IsString() cargo_description?: string | null;
  @IsOptional() @IsString() loading_place?: string | null;
  @IsOptional() @IsDateString() departure_date?: string | null;
  @IsOptional() @IsString() destination?: string | null;
  @IsOptional() @IsDateString() arrival_date?: string | null;
  @IsOptional() @IsString() final_destination?: string | null;
  @IsOptional() @IsString() notes?: string | null;
  @IsOptional() @IsBoolean() isInvoiceCreated?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateQuotationItemDto)
  items?: UpdateQuotationItemDto[];
}
