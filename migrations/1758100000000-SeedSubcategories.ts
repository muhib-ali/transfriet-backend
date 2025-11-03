// src/migrations/1758100000000-SeedSubcategories.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSubcategories1758100000000 implements MigrationInterface {
  name = "SeedSubcategories1758100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ensure gen_random_uuid() is available (optional if already done)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'subcategories'
        ) THEN
          INSERT INTO public."subcategories" ("id","title","created_at","updated_at")
          VALUES
            (gen_random_uuid(), 'import', now(), now()),
            (gen_random_uuid(), 'export', now(), now())
          ON CONFLICT ("title") DO NOTHING;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM public."subcategories" WHERE "title" IN ('import','export');
    `);
  }
}
