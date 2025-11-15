import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1700000000000 implements MigrationInterface {
  name = "Init1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
            CREATE TABLE "domains" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_domains_slug" UNIQUE ("slug")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "countries" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                CONSTRAINT "UQ_countries_slug" UNIQUE ("slug")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "cities" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "country_id" uuid NOT NULL,
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                CONSTRAINT "UQ_cities_slug" UNIQUE ("slug"),
                CONSTRAINT "FK_cities_country_id" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                CONSTRAINT "UQ_roles_slug" UNIQUE ("slug")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "modules" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_modules_slug" UNIQUE ("slug")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tenants" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "description" character varying,
                "slug" character varying NOT NULL,
                "domain_id" uuid,
                CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
                CONSTRAINT "FK_tenants_domain_id" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tenant_allowed_locations" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "country_id" uuid NOT NULL,
                "city_id" uuid NOT NULL,
                "tenant_id" uuid NOT NULL,
                CONSTRAINT "FK_tenant_allowed_locations_country_id" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_tenant_allowed_locations_city_id" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_tenant_allowed_locations_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "module_id" uuid NOT NULL,
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_permissions_slug_module_id" UNIQUE ("slug", "module_id"),
                CONSTRAINT "FK_permissions_module_id" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "role_id" uuid NOT NULL,
                "permission_id" uuid NOT NULL,
                "module_slug" character varying NOT NULL,
                "permission_slug" character varying NOT NULL,
                "is_allowed" boolean NOT NULL,
                CONSTRAINT "UQ_role_permissions_role_id_permission_id" UNIQUE ("role_id", "permission_id"),
                CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_role_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_role_permissions_role_id_permission_id" ON "role_permissions" ("role_id", "permission_id")
        `);

    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "role_id" uuid NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "FK_users_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    
            await queryRunner.query(`
      CREATE TABLE "taxes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_by" character varying,
        "updated_by" character varying,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "value" numeric(5,2) NOT NULL,
        CONSTRAINT "CHK_taxes_value_range" CHECK ("value" >= 0 AND "value" <= 100),
        CONSTRAINT "UQ_taxes_title" UNIQUE ("title")
      )
    `);

   await queryRunner.query(`
        CREATE TABLE "job_files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "is_active" boolean NOT NULL DEFAULT true,
  "created_by" character varying,
  "updated_by" character varying,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "title" character varying NOT NULL,
  "description" character varying,
  CONSTRAINT "UQ_job_files_title" UNIQUE ("title")
);
`);
      await queryRunner.query(`
  CREATE TABLE "products" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "title" character varying NOT NULL,
    "description" character varying,
    "price" numeric(10,2) NOT NULL,
    "job_file_id" uuid,
    CONSTRAINT "UQ_products_title" UNIQUE ("title")
  )
`);
      await queryRunner.query(`ALTER TABLE "products"
ADD CONSTRAINT "FK_products_job_file_id"
FOREIGN KEY ("job_file_id") REFERENCES "job_files"("id")
ON DELETE SET NULL ON UPDATE NO ACTION;`)

         await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_by" character varying,
        "updated_by" character varying,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        "name" character varying NOT NULL,
        "country" character varying NOT NULL,
        "address" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "email" character varying NOT NULL,

        CONSTRAINT "UQ_clients_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
  CREATE TABLE "subcategories" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" character varying NOT NULL UNIQUE,
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
`);
 await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "quotations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    "quote_number" character varying NOT NULL,
    "valid_until" TIMESTAMP WITH TIME ZONE,

    "customer_id" uuid NOT NULL,
    "job_file_id" uuid,

    "shipper_name" character varying,
    "consignee_name" character varying,
    "pieces_or_containers" integer,
    "weight_volume" character varying,
    "cargo_description" character varying,
    "master_bill_no" character varying,
    "loading_place" character varying,
    "departure_date" TIMESTAMP WITH TIME ZONE,
    "destination" character varying,
    "arrival_date" TIMESTAMP WITH TIME ZONE,
    "final_destination" character varying,
    "notes" text,

    "subtotal" numeric(12,2) NOT NULL DEFAULT 0,
    "tax_total" numeric(12,2) NOT NULL DEFAULT 0,
    "grand_total" numeric(12,2) NOT NULL DEFAULT 0,
    "isInvoiceCreated" boolean NOT NULL DEFAULT false,

    CONSTRAINT "UQ_quotations_quote_number" UNIQUE ("quote_number"),
    CONSTRAINT "FK_quotations_customer_id" FOREIGN KEY ("customer_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "FK_quotations_job_file_id" FOREIGN KEY ("job_file_id") REFERENCES "job_files"("id") ON DELETE SET NULL ON UPDATE NO ACTION
  );
`);

await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "quotation_subcategories" (
    "quotation_id" uuid NOT NULL,
    "subcategory_id" uuid NOT NULL,
    PRIMARY KEY ("quotation_id","subcategory_id"),
    CONSTRAINT "FK_qsub_quotation_id" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "FK_qsub_subcategory_id" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
  );
`);
  

    // quotation_items
   await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "quotation_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    "quotation_id" uuid NOT NULL,
    "product_id" uuid NOT NULL,
    "tax_id" uuid,
    "quantity" integer NOT NULL DEFAULT 1,
    "unit_price" numeric(12,2) NOT NULL DEFAULT 0,
    "line_total" numeric(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "FK_qitems_quotation_id" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "FK_qitems_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "FK_qitems_tax_id" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE SET NULL ON UPDATE NO ACTION
  );
`);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "quote_counters" (
        "year" integer PRIMARY KEY,
        "last_serial" integer NOT NULL DEFAULT 0,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    // invoices
await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "invoices" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    "invoice_number" character varying NOT NULL,
    "valid_until" TIMESTAMP WITH TIME ZONE,

    "quotation_id" uuid,
    "customer_id" uuid NOT NULL,
    "job_file_id" uuid,

    "shipper_name" character varying,
    "consignee_name" character varying,
    "pieces_or_containers" integer,
    "weight_volume" character varying,
    "cargo_description" character varying,
    "master_bill_no" character varying,
    "loading_place" character varying,
    "departure_date" TIMESTAMP WITH TIME ZONE,
    "destination" character varying,
    "arrival_date" TIMESTAMP WITH TIME ZONE,
    "final_destination" character varying,
    "notes" text,

    "subtotal" numeric(12,2) NOT NULL DEFAULT 0,
    "tax_total" numeric(12,2) NOT NULL DEFAULT 0,
    "grand_total" numeric(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "UQ_invoices_invoice_number" UNIQUE ("invoice_number"),
    CONSTRAINT "FK_invoices_quotation_id" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "FK_invoices_customer_id"  FOREIGN KEY ("customer_id")  REFERENCES "clients"("id")     ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "FK_invoices_job_file_id"  FOREIGN KEY ("job_file_id")  REFERENCES "job_files"("id")  ON DELETE SET NULL ON UPDATE NO ACTION
  );
`);

// invoices <> subcategories (M2M)
await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "invoice_subcategories" (
    "invoice_id" uuid NOT NULL,
    "subcategory_id" uuid NOT NULL,
    PRIMARY KEY ("invoice_id","subcategory_id"),
    CONSTRAINT "FK_isub_invoice_id"     FOREIGN KEY ("invoice_id")    REFERENCES "invoices"("id")      ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "FK_isub_subcategory_id" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
  );
`);

// invoice_items
await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "invoice_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "is_active" boolean NOT NULL DEFAULT true,
    "created_by" character varying,
    "updated_by" character varying,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    "invoice_id" uuid NOT NULL,
    "product_id" uuid NOT NULL,
    "tax_id" uuid,
    "quantity" integer NOT NULL DEFAULT 1,
    "unit_price" numeric(12,2) NOT NULL DEFAULT 0,
    "line_total" numeric(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "FK_iitems_invoice_id"  FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id")  ON DELETE CASCADE  ON UPDATE NO ACTION,
    CONSTRAINT "FK_iitems_product_id"  FOREIGN KEY ("product_id") REFERENCES "products"("id")  ON DELETE RESTRICT ON UPDATE NO ACTION,
    CONSTRAINT "FK_iitems_tax_id"      FOREIGN KEY ("tax_id")     REFERENCES "taxes"("id")     ON DELETE SET NULL  ON UPDATE NO ACTION
  );
`);

// invoice_counters (for INV-YYYY-XXX)
await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS "invoice_counters" (
    "year" integer PRIMARY KEY,
    "last_serial" integer NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
`);

  
    await queryRunner.query(`
            CREATE TABLE "oauth_tokens" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by" character varying,
                "updated_by" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "name" character varying NOT NULL,
                "token" character varying NOT NULL,
                "refresh_token" character varying NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "revoked" boolean NOT NULL DEFAULT false,
                CONSTRAINT "FK_oauth_tokens_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
              

    await queryRunner.query(`
            CREATE INDEX "IDX_oauth_tokens_token" ON "oauth_tokens" ("token")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_oauth_tokens_userId" ON "oauth_tokens" ("userId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_oauth_tokens_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_oauth_tokens_token"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "oauth_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_role_permissions_role_id_permission_id"`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenant_allowed_locations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "modules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cities"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "countries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "domains"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "taxes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clients"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_job_file_id";`)
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "job_files"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quotation_subcategories";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subcategories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quotation_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quotations"`);
       await queryRunner.query(`DROP TABLE IF EXISTS "quote_counters"`);

       await queryRunner.query(`DROP TABLE IF EXISTS "invoice_items"`);
await queryRunner.query(`DROP TABLE IF EXISTS "invoice_subcategories"`);
await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
await queryRunner.query(`DROP TABLE IF EXISTS "invoice_counters"`);

  }
}
