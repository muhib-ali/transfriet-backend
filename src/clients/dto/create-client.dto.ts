import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreateClientDto {
  @ApiProperty({ description: "Client name", example: "Acme Corp" })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Country", example: "Pakistan" })
  @IsString() @IsNotEmpty()
  country: string;

  @ApiProperty({ description: "Address", example: "Plot 12, Shahrah-e-Faisal, Karachi" })
  @IsString() @IsNotEmpty()
  address: string;

  @ApiProperty({ description: "Phone", example: "+92-300-1234567" })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: "Unique email", example: "ops@acme.com" })
  @IsEmail() @IsNotEmpty()
  email: string;
}
