import { Entity, Column, Unique, OneToMany } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Product } from "./product.entity";
import { Quotation } from "./quotation.entity";

@Entity("categories")
@Unique(["title"])
export class Category extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  // 1 category → many products (inverse of Product.category)
  @OneToMany(() => Product, (p) => p.category)
  products?: Product[];

   @OneToMany(() => Quotation, (q) => q.category)
  quotations: Quotation[];
}
