import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsInt, Min, IsNumber, IsOptional } from "class-validator";

export class InvoiceItemInput {
  @ApiProperty() @IsUUID() product_id: string;
  @ApiProperty({ required: false }) @IsUUID() @IsOptional() tax_id?: string;
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) quantity: number;
  @ApiProperty({ example: 100.00 }) @IsNumber() unit_price: number;
}
