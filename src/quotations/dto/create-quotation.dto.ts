import {
  IsUUID, IsOptional, IsString, IsArray, ValidateNested, IsNumber, Min,
  ArrayMinSize, IsDateString
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateQuotationItemDto {
  @IsUUID() product_id: string;
  @IsOptional() @IsUUID() tax_id?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unit_price: number;
}

export class CreateQuotationDto {
  @ApiPropertyOptional()
  @IsOptional() @IsDateString() valid_until?: string;

  @ApiPropertyOptional()
  @IsUUID() customer_id: string;
  @ApiPropertyOptional()
  @IsOptional() @IsUUID() job_file_id?: string;

  // ✅ multiple subcategories
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  subcategory_ids?: string[];

  @ApiPropertyOptional() @IsOptional() @IsString() shipper_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() consignee_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) pieces_or_containers?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() weight_volume?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cargo_description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() master_bill_no?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() loading_place?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() departure_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destination?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() arrival_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() final_destination?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

  @ApiPropertyOptional({ type: () => [CreateQuotationItemDto] })
  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];
}
