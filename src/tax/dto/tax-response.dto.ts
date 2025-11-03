import { ApiProperty } from "@nestjs/swagger";

export class TaxDto {
  @ApiProperty() id: string;
  @ApiProperty({ description: "Tax title", example: "VAT" }) title: string;
  @ApiProperty({ description: "Unique slug", example: "vat" }) slug: string;
  @ApiProperty({ description: "Tax percentage value (0-100)", example: 17.0 }) value: number;
  @ApiProperty({ description: "Is active", example: true }) is_active: boolean;
  @ApiProperty({ description: "Created by", nullable: true }) created_by: string | null;
  @ApiProperty({ description: "Updated by", nullable: true }) updated_by: string | null;
  @ApiProperty({ description: "Created at" }) created_at: Date;
  @ApiProperty({ description: "Updated at" }) updated_at: Date;
}

export class TaxResponseDto {
  @ApiProperty() statusCode: number;
  @ApiProperty() status: boolean;
  @ApiProperty() message: string;
  @ApiProperty() heading: string;
  @ApiProperty({ type: TaxDto }) data: TaxDto;
}

export class TaxesListResponseDto {
  @ApiProperty() statusCode: number;
  @ApiProperty() status: boolean;
  @ApiProperty() message: string;
  @ApiProperty() heading: string;
  @ApiProperty({
    type: "object",
    properties: {
      taxes: { type: "array", items: { $ref: "#/components/schemas/TaxDto" } },
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
    taxes: TaxDto[];
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
