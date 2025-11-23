import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductTranslationInputDto } from "./product-translation-input.dto";

export class UpdateProductDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 479999.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  // Removed job_file_id; products are no longer linked to job files

  @ApiProperty({
    type: [ProductTranslationInputDto],
    required: false,
    description: "Translations to set/update (e.g. en, ar)",
    example: [
      {
        language_code: "en",
        title: "Iron (Updated)",
        description: "Updated English description",
      },
      {
        language_code: "ar",
        title: "مكواة (محدث)",
        description: "وصف عربي محدث",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationInputDto)
  @IsOptional()
  translations?: ProductTranslationInputDto[];
}
