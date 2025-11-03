import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";
import { Invoice } from "../entities/invoice.entity";
import { InvoiceItem } from "../entities/invoice-item.entity";
import { Client } from "../entities/client.entity";
import { Category } from "../entities/category.entity";
import { Subcategory } from "../entities/subcategory.entity";
import { Product } from "../entities/product.entity";
import { Tax } from "../entities/tax.entity";
import { InvoiceCounter } from "../entities/invoice-counter.entity";
import { Quotation } from "../entities/quotation.entity";
import { QuotationItem } from "../entities/quotation-item.entity";

@NestModule({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      Client,
      Category,
      Subcategory,
      Product,
      Tax,
      InvoiceCounter,
      Quotation,
      QuotationItem,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
