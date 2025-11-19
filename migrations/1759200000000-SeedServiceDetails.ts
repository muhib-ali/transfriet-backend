// src/migrations/1758100000000-SeedServiceDetails.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedServiceDetails1758100000000 implements MigrationInterface {
  name = "SeedServiceDetails1758100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'service_details'
        ) THEN
          INSERT INTO public."service_details" ("id","title","created_at","updated_at")
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
      DELETE FROM public."service_details" WHERE "title" IN ('import','export');
    `);
  }
}