import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Case Studies collection schema (`dbName: cs`).
 * Full DDL was applied via `src/scripts/applyCaseStudiesExtractedSql.ts`
 * (+ `applyCaseStudiesRelsFinish.ts` for shared rel columns).
 *
 * This migration is intentionally idempotent for environments where
 * the script already ran; it only ensures shared lock/redirect wiring.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cs_id" integer;
    ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "cs_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cs_id_idx"
      ON "payload_locked_documents_rels" USING btree ("cs_id");
    CREATE INDEX IF NOT EXISTS "redirects_rels_cs_id_idx"
      ON "redirects_rels" USING btree ("cs_id");

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk"
        FOREIGN KEY ("cs_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN undefined_table THEN NULL;
      WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "redirects_rels"
        ADD CONSTRAINT "redirects_rels_case_studies_fk"
        FOREIGN KEY ("cs_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN undefined_table THEN NULL;
      WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_case_studies_fk";
    ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_case_studies_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_cs_id_idx";
    DROP INDEX IF EXISTS "redirects_rels_cs_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cs_id";
    ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "cs_id";
  `)
}
