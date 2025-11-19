import { Entity, Column, Unique, ManyToMany } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Quotation } from "./quotation.entity";
import { Invoice } from "./invoice.entity";


@Entity("service_details")
@Unique(["title"])
export class ServiceDetail extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

    @ManyToMany(() => Quotation, (q) => q.service_details, { eager: false })
  quotations: Quotation[];
    @ManyToMany(() => Invoice, (i) => i.service_details, { eager: false })
  invoices: Invoice[];
}
