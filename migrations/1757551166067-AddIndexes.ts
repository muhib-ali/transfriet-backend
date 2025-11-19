import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1757551166067 implements MigrationInterface {
  name = "AddIndexes1757551166067";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Core auth / RBAC indexes ---
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_role_permissions_role_id" ON "role_permissions" ("role_id")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_permissions_module_id" ON "permissions" ("module_id")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_role_permissions_composite" ON "role_permissions" ("role_id", "permission_id")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_oauth_tokens_token" ON "oauth_tokens" ("token")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_oauth_tokens_userId" ON "oauth_tokens" ("userId")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_role_id" ON "users" ("role_id")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_permissions_slug" ON "permissions" ("slug")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_modules_slug" ON "modules" ("slug")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_roles_slug" ON "roles" ("slug")`
    );
    await queryRunner.query(
  `CREATE INDEX IF NOT EXISTS "IDX_taxes_title" ON "taxes" ("title")`
);

    // --- Optional client/product/category indexes (guarded) ---
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clients' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_clients_email" ON "clients" ("email")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_clients_name" ON "clients" ("name")';
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'job_files' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_job_files_title" ON "job_files" ("title")';
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'products' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_products_title" ON "products" ("title")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_products_job_file_id" ON "products" ("job_file_id")';
        END IF;
      END
      $$;
    `);

    // --- Quotations & items ---
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'quotations' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_quotations_customer_id" ON "quotations" ("customer_id")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_quotations_created_at" ON "quotations" ("created_at")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_quotations_quote_number" ON "quotations" ("quote_number")';
          -- NOTE: using junction table indexes for service details below
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'quotation_items' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qitems_quotation_id" ON "quotation_items" ("quotation_id")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qitems_product_id" ON "quotation_items" ("product_id")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qitems_tax_id" ON "quotation_items" ("tax_id")';
        END IF;
      END
      $$;
    `);

    // Junction table indexes for many-to-many service details
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'quotation_service_details' AND relkind = 'r') THEN
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qsdet_quotation_id" ON "quotation_service_details" ("quotation_id")';
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qsdet_service_detail_id" ON "quotation_service_details" ("service_detail_id")';
          -- helpful reverse lookup (service_detail -> quotations)
          EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_qsdet_service_detail_quotation" ON "quotation_service_details" ("service_detail_id","quotation_id")';
        END IF;
      END
      $$;
    `);

    // Invoices
await queryRunner.query(`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'invoices' AND relkind = 'r') THEN
      -- helpful filters/sorts
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_invoices_created_at"   ON "invoices" ("created_at")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_invoices_customer_id"  ON "invoices" ("customer_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_invoices_job_file_id"  ON "invoices" ("job_file_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_invoices_quotation_id" ON "invoices" ("quotation_id")';
      -- UNIQUE already makes an index, but safe to ensure name-based lookups:
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_invoices_invoice_number" ON "invoices" ("invoice_number")';
    END IF;
  END
  $$;
`);

// Invoice items
await queryRunner.query(`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'invoice_items' AND relkind = 'r') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_iitems_invoice_id" ON "invoice_items" ("invoice_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_iitems_product_id" ON "invoice_items" ("product_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_iitems_tax_id"     ON "invoice_items" ("tax_id")';
    END IF;
  END
  $$;
`);

// Invoice <> Service Details junction (M2M)
await queryRunner.query(`
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'invoice_service_details' AND relkind = 'r') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_isdet_invoice_id"      ON "invoice_service_details" ("invoice_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_isdet_service_detail_id"  ON "invoice_service_details" ("service_detail_id")';
      EXECUTE 'CREATE INDEX IF NOT EXISTS "IDX_isdet_service_detail_invoice" ON "invoice_service_details" ("service_detail_id","invoice_id")';
    END IF;
  END
  $$;
`);


    // convenience composite for RBAC filtering
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_role_permissions_role_module" ON "role_permissions" ("role_id", "module_slug")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // RBAC composite
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_role_permissions_role_module"`);

    // Junction table indexes (new)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qsdet_service_detail_quotation"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qsdet_service_detail_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qsdet_quotation_id"`);

    // Quotation/item indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qitems_tax_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qitems_product_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_qitems_quotation_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotations_quote_number"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotations_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotations_customer_id"`);
    // (No drop for old subcategory FK index—no longer created)

// invoice_service_details
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_isdet_service_detail_invoice"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_isdet_service_detail_id"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_isdet_invoice_id"`);

// invoice_items
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iitems_tax_id"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iitems_product_id"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iitems_invoice_id"`);

// invoices
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoices_invoice_number"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoices_quotation_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoices_job_file_id"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoices_customer_id"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoices_created_at"`);


    // Optional client/product/category indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_job_file_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_title"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_job_files_title"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_clients_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_clients_email"`);

    // Core auth / RBAC
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_taxes_title"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_modules_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_permissions_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_oauth_tokens_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_oauth_tokens_token"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_role_permissions_composite"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_permissions_module_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_role_permissions_role_id"`);
  }
}
