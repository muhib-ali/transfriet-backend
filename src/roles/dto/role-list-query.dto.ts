import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class RoleListQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Optional search term", example: "admin" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}