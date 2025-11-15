import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateJobFileDto {
  @ApiProperty({ example: "Electronics" })
  @IsString() @IsNotEmpty() @MaxLength(255)
  title: string;

  @ApiProperty({ example: "Electronic and smart devices", required: false })
  @IsString() @IsOptional()
  description?: string;
}
