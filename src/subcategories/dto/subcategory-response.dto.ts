import { ApiProperty } from "@nestjs/swagger";

export class SubcategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;

  @ApiProperty() is_active: boolean;
  @ApiProperty({ nullable: true }) created_by: string | null;
  @ApiProperty({ nullable: true }) updated_by: string | null;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}

export class SubcategoryResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Subcategory retrieved successfully" }) message: string;
  @ApiProperty({ example: "Subcategory" }) heading: string;
  @ApiProperty({ type: SubcategoryDto }) data: SubcategoryDto;
}

export class SubcategoriesListResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Subcategories retrieved successfully" }) message: string;
  @ApiProperty({ example: "Subcategory" }) heading: string;
  @ApiProperty({
    type: "object",
    properties: {
      subcategories: { type: "array", items: { $ref: "#/components/schemas/SubcategoryDto" } },
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
    subcategories: SubcategoryDto[];
    pagination: {
      page: number; limit: number; total: number; totalPages: number;
      hasNext: boolean; hasPrev: boolean; nextPage: number | null; prevPage: number | null;
    };
  };
}
