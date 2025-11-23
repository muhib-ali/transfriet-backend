import { Entity, Column, Unique, OneToMany } from "typeorm";
import { BaseAuditColumns } from "./base-audit-columns.entity";
import { Quotation } from "./quotation.entity";

@Entity("job_files")
@Unique(["title"])
export class JobFile extends BaseAuditColumns {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", nullable: true })
  description: string | null;

  // Product relation removed; products no longer linked to job files

   @OneToMany(() => Quotation, (q) => q.category)
  quotations: Quotation[];

  
}
