import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("quote_counters")
export class QuoteCounter {
  @PrimaryColumn({ type: "int" })
  year: number;

  @Column({ type: "int", default: 0 })
  last_serial: number;

  @Column({ type: "timestamptz", default: () => "now()" })
  updated_at: Date;
}
