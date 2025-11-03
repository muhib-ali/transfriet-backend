import { Entity, Column, Unique } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { OneToMany } from "typeorm";
import { QuotationItem } from "./quotation-item.entity";
import { InvoiceItem } from "./invoice-item.entity";

@Entity("taxes")
@Unique(["slug"])
export class Tax extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  slug: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  value: number;

    @OneToMany(() => QuotationItem, (qi) => qi.tax)
  quotation_items: QuotationItem[];
    @OneToMany(() => InvoiceItem, (ii) => ii.tax)
    invoice_items: InvoiceItem[];
}
