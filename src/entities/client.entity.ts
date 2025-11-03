import { InvoiceItem } from './invoice-item.entity';
import { Entity, Column, Unique } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { OneToMany } from "typeorm";
import { Quotation } from "./quotation.entity";
import { Invoice } from "./invoice.entity";

@Entity("clients")
@Unique(["email"])
export class Client extends BaseAuditColumns {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  country: string;

  @Column({ type: "varchar" })
  address: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "varchar" })
  email: string;

    @OneToMany(() => Quotation, (q) => q.customer)
  quotations: Quotation[];
    @OneToMany(() => Invoice, (i) => i.customer)
  invoices: Invoice[];


}
