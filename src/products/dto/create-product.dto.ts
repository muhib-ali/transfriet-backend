import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductTranslationInputDto } from "./product-translation-input.dto";

export class CreateProductDto {
  @ApiProperty({ example: 489999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  // Removed job_file_id; products are no longer linked to job files

  @ApiProperty({
    type: [ProductTranslationInputDto],
    description: "At least one language translation (e.g. en, ar)",
    example: [
      {
        language_code: "en",
        title: "Iron",
        description: "High quality iron",
      },
      {
        language_code: "ar",
        title: "مكواة",
        description: "مكواة عالية الجودة",
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationInputDto)
  translations: ProductTranslationInputDto[];
}
