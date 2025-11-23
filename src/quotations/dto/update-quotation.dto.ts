import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString, IsBoolean
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

class UpdateQuotationItemDto {
  @IsUUID() product_id: string;
  @IsOptional() @IsUUID() tax_id?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unit_price: number;
}

export class UpdateQuotationDto {
  @ApiPropertyOptional()
  @IsUUID() id: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() valid_until?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsUUID() customer_id?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() job_file_id?: string | null;

  // ✅ multi service details
  @ApiPropertyOptional({ type: [String], description: "Service Detail UUIDs" })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  service_detail_ids?: string[] | null;

  @ApiPropertyOptional() @IsOptional() @IsString() shipper_name?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() consignee_name?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number | null;
  @ApiPropertyOptional() @IsOptional() @IsString() weight_volume?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() cargo_description?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() master_bill_no?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() loading_place?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsDateString() departure_date?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() destination?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsDateString() arrival_date?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() final_destination?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() notes_en?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() notes_ar?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isInvoiceCreated?: boolean;

  @ApiPropertyOptional({ type: () => [UpdateQuotationItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateQuotationItemDto)
  items?: UpdateQuotationItemDto[];
}
