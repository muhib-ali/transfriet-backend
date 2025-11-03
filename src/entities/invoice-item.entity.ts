import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Invoice } from "./invoice.entity";
import { Product } from "./product.entity";
import { Tax } from "./tax.entity";

@Entity("invoice_items")
export class InvoiceItem extends BaseAuditColumns {
  @Column({ type: "uuid" }) invoice_id: string;

  @ManyToOne(() => Invoice, (i) => i.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice;

  @Column({ type: "uuid" }) product_id: string;

  @ManyToOne(() => Product, (p) => p.quotation_items, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "uuid", nullable: true }) tax_id: string | null;

  @ManyToOne(() => Tax, (t) => t.quotation_items, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "tax_id" })
  tax?: Tax | null;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  unit_price: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  line_total: string;
}
