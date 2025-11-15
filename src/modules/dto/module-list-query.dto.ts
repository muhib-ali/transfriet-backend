import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class ModuleListQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Optional search term", example: "claims" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}