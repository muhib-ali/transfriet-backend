import { ApiProperty } from "@nestjs/swagger";

class QuotationItemDto {
  @ApiProperty() id: string;
  @ApiProperty() product_id: string;
  @ApiProperty({ nullable: true }) tax_id: string | null;
  @ApiProperty() quantity: number;
  @ApiProperty() unit_price: string;
  @ApiProperty() line_total: string;
}

export class QuotationDto {
  @ApiProperty() id: string;
  @ApiProperty() quote_number: string;
  @ApiProperty({ nullable: true }) valid_until: string | null;
  @ApiProperty() customer_id: string;
  @ApiProperty({ nullable: true }) master_bill_no: string | null;
  @ApiProperty({ nullable: true }) job_file_id: string | null;
  @ApiProperty({ nullable: true }) subcategory_id: string | null;
  @ApiProperty({ nullable: true }) shipper_name: string | null;
  @ApiProperty({ nullable: true }) consignee_name: string | null;
  @ApiProperty({ nullable: true }) pieces_or_containers: string | null;
  @ApiProperty({ nullable: true }) weight_volume: string | null;
  @ApiProperty({ nullable: true }) cargo_description: string | null;
  @ApiProperty({ nullable: true }) loading_place: string | null;
  @ApiProperty({ nullable: true }) departure_date: string | null;
  @ApiProperty({ nullable: true }) destination: string | null;
  @ApiProperty({ nullable: true }) arrival_date: string | null;
  @ApiProperty({ nullable: true }) final_destination: string | null;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty() subtotal: string;
  @ApiProperty() tax_total: string;
  @ApiProperty() grand_total: string;
  @ApiProperty() isInvoiceCreated: boolean;
  @ApiProperty({ type: [QuotationItemDto] }) items: QuotationItemDto[];
}

export class QuotationResponseDto {
  @ApiProperty() statusCode: number;
  @ApiProperty() status: boolean;
  @ApiProperty() message: string;
  @ApiProperty() heading: string;
  @ApiProperty({ type: QuotationDto }) data: QuotationDto;
}

export class QuotationsListResponseDto {
  @ApiProperty() statusCode: number;
  @ApiProperty() status: boolean;
  @ApiProperty() message: string;
  @ApiProperty() heading: string;
  @ApiProperty({
    type: "object",
    properties: {
      quotations: { type: "array", items: { $ref: "#/components/schemas/QuotationDto" } },
      pagination: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          totalPages: { type: "number" },
          hasNext: { type: "boolean" },
          hasPrev: { type: "boolean" },
          nextPage: { type: "number", nullable: true },
          prevPage: { type: "number", nullable: true }
        }
      }
    }
  })
  data: {
    quotations: QuotationDto[],
    pagination: {
      page: number; limit: number; total: number; totalPages: number;
      hasNext: boolean; hasPrev: boolean; nextPage: number | null; prevPage: number | null;
    }
  };
}
