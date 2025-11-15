import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from "class-validator";

export class UpdateJobFileDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID() @IsNotEmpty()
  id: string;

  @ApiProperty({ example: "Electronics" })
  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  @ApiProperty({ example: "All gadgets", required: false })
  @IsString() @IsOptional()
  description?: string;
}
