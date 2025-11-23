import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateInvoiceItemDto {
  @ApiProperty({ format: "uuid", description: "Product ID" })
  @IsUUID() product_id: string;

  @ApiPropertyOptional({ format: "uuid", description: "Tax ID (optional)" })
  @IsOptional() @IsUUID() tax_id?: string;

  @ApiProperty({ type: Number, minimum: 1, description: "Quantity" })
  @IsNumber() @Min(1) quantity: number;

  @ApiProperty({ type: Number, minimum: 0, description: "Unit price" })
  @IsNumber() @Min(0) unit_price: number;
}

export class CreateInvoiceDto {
  @ApiPropertyOptional({ type: String, format: "date-time", description: "Invoice validity date" })
  @IsOptional() @IsDateString() valid_until?: string;

  // optional quotation to prefill
  @ApiPropertyOptional({ format: "uuid", description: "Quotation ID to prefill" })
  @IsOptional() @IsUUID() quotation_id?: string;

  @ApiProperty({ format: "uuid", description: "Customer ID" })
  @IsUUID() customer_id: string;

  @ApiPropertyOptional({ format: "uuid", description: "Linked Job File ID" })
  @IsOptional() @IsUUID() job_file_id?: string;

  @ApiPropertyOptional({ type: [String], description: "Service Detail UUIDs" })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  service_detail_ids?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() shipper_name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() consignee_name?: string;

  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() weight_volume?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() cargo_description?: string;

  @ApiPropertyOptional({ type: String, description: "Master Bill Number" })
  @IsOptional() @IsString() master_bill_no?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() loading_place?: string;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional() @IsDateString() departure_date?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() destination?: string;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  @IsOptional() @IsDateString() arrival_date?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() final_destination?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() notes_en?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() notes_ar?: string;

  @ApiProperty({ type: [CreateInvoiceItemDto], description: "Invoice items" })
  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
