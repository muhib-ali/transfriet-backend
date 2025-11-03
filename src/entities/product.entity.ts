import { Entity, Column, Unique, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Category } from "./category.entity";
import { OneToMany } from "typeorm";
import { QuotationItem } from "./quotation-item.entity";
import { InvoiceItem } from "./invoice-item.entity";

@Entity("products")
@Unique(["slug"])
export class Product extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  slug: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number;

  // FK column
  @Column({ type: "uuid", nullable: true })
  category_id: string | null;

  // 🔗 Relation: many products → one category
  @ManyToOne(() => Category, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category?: Category | null;

   @OneToMany(() => QuotationItem, (qi) => qi.product)
  quotation_items: QuotationItem[];

    @OneToMany(() => InvoiceItem, (ii) => ii.product)
    invoice_items: InvoiceItem[];
}

