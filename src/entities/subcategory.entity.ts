import { Entity, Column, Unique, ManyToMany } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Quotation } from "./quotation.entity";
import { Invoice } from "./invoice.entity";


@Entity("subcategories")
@Unique(["title"])
export class Subcategory extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

    @ManyToMany(() => Quotation, (q) => q.subcategories, { eager: false })
  quotations: Quotation[];
    @ManyToMany(() => Invoice, (i) => i.subcategories, { eager: false })
  invoices: Invoice[];
}
