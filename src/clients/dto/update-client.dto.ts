import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsUUID } from "class-validator";

export class UpdateClientDto {
  @ApiProperty({ description: "Client ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID() @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "Client name", example: "Acme Corporation" })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Country", example: "Pakistan" })
  @IsString() @IsNotEmpty()
  country: string;

  @ApiProperty({ description: "Address", example: "Plot 12, Shahrah-e-Faisal, Karachi" })
  @IsString() @IsNotEmpty()
  address: string;

  @ApiProperty({ description: "Phone", example: "+92-300-9876543" })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: "Unique email", example: "contact@acme.com" })
  @IsEmail() @IsNotEmpty()
  email: string;
}
