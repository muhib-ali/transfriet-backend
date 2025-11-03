import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, MaxLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 15 Pro" })
  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  @ApiProperty({ example: "iphone-15-pro" })
  @IsString() @IsNotEmpty() @MaxLength(255)
  slug: string;

  @ApiProperty({ example: "Apple flagship phone", required: false })
  @IsString() @IsOptional()
  description?: string;

  @ApiProperty({ example: 489999.99 })
  @IsNumber() @Min(0)
  price: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", required: false })
  @IsUUID() @IsOptional()
  category_id?: string;
}
