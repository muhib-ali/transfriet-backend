import {
  Entity,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { QuotationItem } from "./quotation-item.entity";
import { InvoiceItem } from "./invoice-item.entity";
import { ProductTranslation } from "./product-translation.entity";

@Entity("products")
export class Product extends BaseAuditColumns {
  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number;

  // Removed job_file_id and JobFile relation

  @OneToMany(() => QuotationItem, (qi) => qi.product)
  quotation_items: QuotationItem[];

  @OneToMany(() => InvoiceItem, (ii) => ii.product)
  invoice_items: InvoiceItem[];

  @OneToMany(() => ProductTranslation, (t) => t.product, { cascade: true })
  translations: ProductTranslation[];
}
