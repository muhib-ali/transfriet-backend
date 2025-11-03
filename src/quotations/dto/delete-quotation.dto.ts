import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteQuotationDto {
  @ApiProperty({ description: "Quotation ID", example: "uuid" })
  @IsUUID() @IsNotEmpty()
  id: string;
}
