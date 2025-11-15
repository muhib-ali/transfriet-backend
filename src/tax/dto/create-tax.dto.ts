import { IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaxDto {
  @ApiProperty({ description: "Tax title", example: "VAT" })
  @IsString()
  @IsNotEmpty()
  title: string;

 

  @ApiProperty({ description: "Tax percentage (0-100)", example: 17.0 })
  @IsNumber()
  value: number;
}
