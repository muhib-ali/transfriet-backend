import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateInvoiceItemDto {
  @ApiProperty({ format: "uuid", description: "Product ID" })
  @IsUUID() product_id: string;

  @ApiPropertyOptional({ format: "uuid", description: "Tax ID (optional)" })
  @IsOptional() @IsUUID() tax_id?: string;

  @ApiProperty({ type: Number, minimum: 1, description: "Quantity" })
  @IsNumber() @Min(1) quantity: number;

  @ApiProperty({ type: Number, minimum: 0, description: "Unit price" })
  @IsNumber() @Min(0) unit_price: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ format: "uuid", description: "Invoice ID" })
  @IsUUID() id: string;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional() @IsDateString() valid_until?: string | null;

  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional() @IsUUID() quotation_id?: string | null;

  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional() @IsUUID() customer_id?: string;

  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional() @IsUUID() job_file_id?: string | null;

  @ApiPropertyOptional({ type: [String], description: "Service Detail UUIDs" })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  service_detail_ids?: string[] | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() shipper_name?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() consignee_name?: string | null;

  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() weight_volume?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() cargo_description?: string | null;

  @ApiPropertyOptional({ type: String, description: "Master Bill Number" })
  @IsOptional() @IsString() master_bill_no?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() loading_place?: string | null;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional() @IsDateString() departure_date?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() destination?: string | null;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional() @IsDateString() arrival_date?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() final_destination?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() notes_en?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() notes_ar?: string | null;

  @ApiPropertyOptional({ type: [UpdateInvoiceItemDto], description: "Invoice items" })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateInvoiceItemDto)
  items?: UpdateInvoiceItemDto[];
}
