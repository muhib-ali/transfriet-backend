import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuotationsController } from "./quotations.controller";
import { QuotationsService } from "./quotations.service";
import { Quotation } from "../entities/quotation.entity";
import { QuotationItem } from "../entities/quotation-item.entity";
import { Client } from "../entities/client.entity";
import { JobFile } from "../entities/job-file.entity";
import { Subcategory } from "../entities/subcategory.entity";
import { Product } from "../entities/product.entity";
import { Tax } from "../entities/tax.entity";
import { QuoteCounter } from "../entities/quote-counter.entity";

@NestModule({
  imports: [
    TypeOrmModule.forFeature([
      Quotation,
      QuotationItem,
      Client,
      JobFile,
      Subcategory,
      Product,
      Tax,
      QuoteCounter,
    ]),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
