import { Entity, Column, Unique, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { JobFile } from "./job-file.entity";
import { OneToMany } from "typeorm";
import { QuotationItem } from "./quotation-item.entity";
import { InvoiceItem } from "./invoice-item.entity";
// import { ProductTranslation } from "./product-translation.entity";

@Entity("products")
@Unique(["title"])
export class Product extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

 

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number;

  // FK column
  @Column({ type: "uuid", nullable: true })
  job_file_id: string | null;

  // 🔗 Relation: many products → onea category
  @ManyToOne(() => JobFile, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "job_file_id" })
  category?: JobFile | null;

   @OneToMany(() => QuotationItem, (qi) => qi.product)
  quotation_items: QuotationItem[];

    @OneToMany(() => InvoiceItem, (ii) => ii.product)
    invoice_items: InvoiceItem[];
}

