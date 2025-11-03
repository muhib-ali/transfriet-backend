import { ApiProperty } from "@nestjs/swagger";

export class ClientDto {
  @ApiProperty({ description: "Client ID" }) id: string;
  @ApiProperty({ description: "Client name", example: "Acme Corp" }) name: string;
  @ApiProperty({ description: "Country", example: "Pakistan" }) country: string;
  @ApiProperty({ description: "Address", example: "Plot 12, Shahrah-e-Faisal, Karachi" }) address: string;
  @ApiProperty({ description: "Phone", example: "+92-300-1234567" }) phone: string;
  @ApiProperty({ description: "Email", example: "ops@acme.com" }) email: string;

  @ApiProperty({ description: "Is active", example: true }) is_active: boolean;
  @ApiProperty({ description: "Created by", nullable: true }) created_by: string | null;
  @ApiProperty({ description: "Updated by", nullable: true }) updated_by: string | null;
  @ApiProperty({ description: "Created at" }) created_at: Date;
  @ApiProperty({ description: "Updated at" }) updated_at: Date;
}

export class ClientResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Client retrieved successfully" }) message: string;
  @ApiProperty({ example: "Client" }) heading: string;
  @ApiProperty({ type: ClientDto }) data: ClientDto;
}

export class ClientsListResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Clients retrieved successfully" }) message: string;
  @ApiProperty({ example: "Client" }) heading: string;

  @ApiProperty({
    type: "object",
    properties: {
      clients: { type: "array", items: { $ref: "#/components/schemas/ClientDto" } },
      pagination: {
        type: "object",
        properties: {
          page: { type: "number", example: 1 },
          limit: { type: "number", example: 10 },
          total: { type: "number", example: 50 },
          totalPages: { type: "number", example: 5 },
          hasNext: { type: "boolean", example: true },
          hasPrev: { type: "boolean", example: false },
          nextPage: { type: "number", example: 2, nullable: true },
          prevPage: { type: "number", example: null, nullable: true },
        },
      },
    },
  })
  data: {
    clients: ClientDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}
