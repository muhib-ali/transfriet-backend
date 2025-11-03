import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("invoice_counters")
export class InvoiceCounter {
  @PrimaryColumn({ type: "int" })
  year: number;

  @Column({ type: "int", default: 0 })
  last_serial: number;

  @Column({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
