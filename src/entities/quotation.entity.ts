import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  ManyToMany, JoinTable, OneToMany, JoinColumn
} from "typeorm";
import { Client } from "./client.entity";
import { Category } from "./category.entity";
import { Subcategory } from "./subcategory.entity";
import { QuotationItem } from "./quotation-item.entity";

@Entity("quotations")
export class Quotation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "varchar", nullable: true })
  created_by: string | null;

  @Column({ type: "varchar", nullable: true })
  updated_by: string | null;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at: Date;

  @Column({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;

  @Column({ type: "varchar", unique: true })
  quote_number: string;

  @Column({ type: "timestamptz", nullable: true })
  valid_until: Date | null;

  // FK name MUST be customer_id to match migration/table
  @ManyToOne(() => Client, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "customer_id" })
  customer: Client;

  // FK name MUST be category_id
  @ManyToOne(() => Category, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category: Category | null;

  // Many subcategories via join table
  @ManyToMany(() => Subcategory, (s) => s.quotations, { cascade: false })
  @JoinTable({
    name: "quotation_subcategories",
    joinColumn: { name: "quotation_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "subcategory_id", referencedColumnName: "id" },
  })
  subcategories: Subcategory[];

  @Column({ type: "varchar", nullable: true })
  shipper_name: string | null;

  @Column({ type: "varchar", nullable: true })
  consignee_name: string | null;

  @Column({ type: "int", nullable: true })
  pieces_or_containers: number | null;

  @Column({ type: "varchar", nullable: true })
  weight_volume: string | null;

  @Column({ type: "varchar", nullable: true })
  cargo_description: string | null;

  @Column({ type: "varchar", nullable: true })
  master_bill_no: string | null;

  @Column({ type: "varchar", nullable: true })
  loading_place: string | null;

  @Column({ type: "timestamptz", nullable: true })
  departure_date: Date | null;

  @Column({ type: "varchar", nullable: true })
  destination: string | null;

  @Column({ type: "timestamptz", nullable: true })
  arrival_date: Date | null;

  @Column({ type: "varchar", nullable: true })
  final_destination: string | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  subtotal: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  tax_total: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  grand_total: string;

  @Column({ type: "boolean", default: false })
  isInvoiceCreated: boolean;

  @OneToMany(() => QuotationItem, (i) => i.quotation, { cascade: true })
  items: QuotationItem[];
}
