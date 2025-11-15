import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export class JobFileListQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Optional search term", example: "air freight" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}