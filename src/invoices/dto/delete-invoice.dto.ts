import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteInvoiceDto {
  @ApiProperty({ description: "Invoice ID", example: "uuid" })
  @IsUUID() @IsNotEmpty()
  id: string;
}
