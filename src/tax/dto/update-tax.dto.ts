import { IsUUID, IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaxDto {
  @ApiProperty({ description: "Tax ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "Tax title", example: "VAT" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Unique slug (identifier)", example: "vat" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: "Tax percentage (0-100)", example: 18.0 })
  @IsNumber()
  value: number;
}
