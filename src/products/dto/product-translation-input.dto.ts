import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class ProductTranslationInputDto {
  @ApiProperty({ example: "en", description: "Language code, e.g. en, ar" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  language_code: string;

  @ApiProperty({ example: "Iron" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: "High quality iron", required: false })
  @IsString()
  @MaxLength(1000)
  description?: string;
}
