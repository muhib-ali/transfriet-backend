import { ApiProperty } from "@nestjs/swagger";

export class ServiceDetailDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;

  @ApiProperty() is_active: boolean;
  @ApiProperty({ nullable: true }) created_by: string | null;
  @ApiProperty({ nullable: true }) updated_by: string | null;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}

export class ServiceDetailResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Service detail retrieved successfully" }) message: string;
  @ApiProperty({ example: "Service Detail" }) heading: string;
  @ApiProperty({ type: ServiceDetailDto }) data: ServiceDetailDto;
}

export class ServiceDetailsListResponseDto {
  @ApiProperty({ example: 200 }) statusCode: number;
  @ApiProperty({ example: true }) status: boolean;
  @ApiProperty({ example: "Service details retrieved successfully" }) message: string;
  @ApiProperty({ example: "Service Detail" }) heading: string;
  @ApiProperty({
    type: "object",
    properties: {
      service_details: { type: "array", items: { $ref: "#/components/schemas/ServiceDetailDto" } },
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
    service_details: ServiceDetailDto[];
    pagination: {
      page: number; limit: number; total: number; totalPages: number;
      hasNext: boolean; hasPrev: boolean; nextPage: number | null; prevPage: number | null;
    };
  };
}
