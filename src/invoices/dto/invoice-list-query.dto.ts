import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class InvoiceListQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Search term to filter invoices by number, customer, job file, etc.",
    example: "INV-2024" 
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  search?: string;
}