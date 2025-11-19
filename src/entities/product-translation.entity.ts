import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Product } from "./product.entity";

@Entity("product_translations")
@Unique(["product", "language_code"])
export class ProductTranslation extends BaseAuditColumns {
  @Column({ type: "varchar", length: 5 })
  language_code: string; // e.g. "en", "ar"

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  @ManyToOne(() => Product, (product) => product.translations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;
}
