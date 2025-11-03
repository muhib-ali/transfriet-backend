import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Quotation } from "./quotation.entity";
import { Product } from "./product.entity";
import { Tax } from "./tax.entity";

@Entity("quotation_items")
export class QuotationItem extends BaseAuditColumns {
  @Column({ type: "uuid" })
  quotation_id: string;

  @ManyToOne(() => Quotation, (q) => q.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quotation_id" })
  quotation: Quotation;

  @Column({ type: "uuid" })
  product_id: string;

  @ManyToOne(() => Product, (p) => p.quotation_items, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "uuid", nullable: true })
  tax_id: string | null;

  @ManyToOne(() => Tax, (t) => t.quotation_items, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "tax_id" })
  tax?: Tax | null;

  @Column({ type: "int", default: 1 })
  quantity: number;

  // keep as string to match numeric column handling
  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  unit_price: string;

  // 👇 only this one total field (subtotal + tax)
  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  line_total: string;
}
