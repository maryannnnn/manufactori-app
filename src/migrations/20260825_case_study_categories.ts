import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "csc" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "case_study_long_title" varchar NOT NULL,
      "case_study_description" jsonb,
      "case_study_image_id" integer,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "parent_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "csc_breadcrumbs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "doc_id" integer,
      "url" varchar,
      "label" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "csc" ADD CONSTRAINT "csc_case_study_image_id_media_id_fk"
        FOREIGN KEY ("case_study_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "csc" ADD CONSTRAINT "csc_parent_id_csc_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."csc"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "csc_breadcrumbs" ADD CONSTRAINT "csc_breadcrumbs_doc_id_csc_id_fk"
        FOREIGN KEY ("doc_id") REFERENCES "public"."csc"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "csc_breadcrumbs" ADD CONSTRAINT "csc_breadcrumbs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."csc"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "csc_slug_idx" ON "csc" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "csc_parent_idx" ON "csc" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "csc_case_study_image_idx" ON "csc" USING btree ("case_study_image_id");
    CREATE INDEX IF NOT EXISTS "csc_updated_at_idx" ON "csc" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "csc_created_at_idx" ON "csc" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "csc_breadcrumbs_order_idx" ON "csc_breadcrumbs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "csc_breadcrumbs_parent_id_idx" ON "csc_breadcrumbs" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "csc_breadcrumbs_doc_idx" ON "csc_breadcrumbs" USING btree ("doc_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "csc_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_csc_fk"
        FOREIGN KEY ("csc_id") REFERENCES "public"."csc"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_csc_id_idx"
      ON "payload_locked_documents_rels" USING btree ("csc_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_csc_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_csc_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "csc_id";
    DROP TABLE IF EXISTS "csc_breadcrumbs" CASCADE;
    DROP TABLE IF EXISTS "csc" CASCADE;
  `)
}
