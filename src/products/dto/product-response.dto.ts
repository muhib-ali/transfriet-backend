import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() slug: string;
  @ApiProperty({ nullable: true }) description: string | null;
  @ApiProperty() price: number;
  @ApiProperty({ nullable: true }) category_id: string | null;

  @ApiProperty() is_active: boolean;
  @ApiProperty({ nullable: true }) created_by: string | null;
  @ApiProperty({ nullable: true }) updated_by: string | null;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}

export class ProductResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Product retrieved successfully" }) message: string;
  @ApiProperty({ example: "Product" }) heading: string;
  @ApiProperty({ type: ProductDto }) data: ProductDto;
}

export class ProductsListResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Products retrieved successfully" }) message: string;
  @ApiProperty({ example: "Product" }) heading: string;
  @ApiProperty({
    type: "object",
    properties: {
      products: { type: "array", items: { $ref: "#/components/schemas/ProductDto" } },
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
    products: ProductDto[];
    pagination: {
      page: number; limit: number; total: number; totalPages: number;
      hasNext: boolean; hasPrev: boolean; nextPage: number | null; prevPage: number | null;
    };
  };
}
