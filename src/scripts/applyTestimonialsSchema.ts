import 'dotenv/config'
import pg from 'pg'

/**
 * Non-interactive schema for Testimonials (`dbName: tstm`).
 * Draft autosave requires title / long title / testimonial to be nullable in Postgres.
 */
const sql = `
DO $$ BEGIN
  CREATE TYPE "enum_tstm_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__tstm_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_tstm_testimonial_type" AS ENUM('client', 'project', 'service', 'general');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__tstm_v_version_testimonial_type" AS ENUM('client', 'project', 'service', 'general');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_tstm_source_type" AS ENUM('direct', 'email', 'website', 'google', 'linkedin', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__tstm_v_version_source_type" AS ENUM('direct', 'email', 'website', 'google', 'linkedin', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_tstm_rating" AS ENUM('1', '2', '3', '4', '5');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__tstm_v_version_rating" AS ENUM('1', '2', '3', '4', '5');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "tstm" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar,
  "testimonial_long_title" varchar,
  "testimonial_content_title" varchar,
  "testimonial_preview_title" varchar,
  "testimonial_preview_description" varchar,
  "testimonial_preview_image_id" integer,
  "testimonial" jsonb,
  "client_name" varchar,
  "client_position" varchar,
  "client_company" varchar,
  "client_company_website" varchar,
  "client_location" varchar,
  "project_context" varchar,
  "service_id" integer,
  "case_study_id" integer,
  "testimonial_type" "enum_tstm_testimonial_type",
  "source_type" "enum_tstm_source_type",
  "source_url" varchar,
  "verified" boolean DEFAULT false,
  "meta_title" varchar,
  "meta_image_id" integer,
  "meta_description" varchar,
  "testimonial_date" timestamp(3) with time zone,
  "rating" "enum_tstm_rating",
  "published_at" timestamp(3) with time zone,
  "generate_slug" boolean DEFAULT true,
  "slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "_status" "enum_tstm_status" DEFAULT 'draft'
);

DO $$ BEGIN
  ALTER TABLE "tstm" ADD CONSTRAINT "tstm_testimonial_preview_image_id_media_id_fk"
    FOREIGN KEY ("testimonial_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "tstm" ADD CONSTRAINT "tstm_meta_image_id_media_id_fk"
    FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "tstm" ADD CONSTRAINT "tstm_service_id_svc_id_fk"
    FOREIGN KEY ("service_id") REFERENCES "public"."svc"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "tstm" ADD CONSTRAINT "tstm_case_study_id_cs_id_fk"
    FOREIGN KEY ("case_study_id") REFERENCES "public"."cs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "tstm_testimonial_preview_image_idx" ON "tstm" USING btree ("testimonial_preview_image_id");
CREATE INDEX IF NOT EXISTS "tstm_meta_image_idx" ON "tstm" USING btree ("meta_image_id");
CREATE INDEX IF NOT EXISTS "tstm_service_idx" ON "tstm" USING btree ("service_id");
CREATE INDEX IF NOT EXISTS "tstm_case_study_idx" ON "tstm" USING btree ("case_study_id");
CREATE UNIQUE INDEX IF NOT EXISTS "tstm_slug_idx" ON "tstm" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "tstm_updated_at_idx" ON "tstm" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "tstm_created_at_idx" ON "tstm" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "tstm_status_idx" ON "tstm" USING btree ("_status");

CREATE TABLE IF NOT EXISTS "_tstm_v" (
  "id" serial PRIMARY KEY NOT NULL,
  "parent_id" integer,
  "version_title" varchar,
  "version_testimonial_long_title" varchar,
  "version_testimonial_content_title" varchar,
  "version_testimonial_preview_title" varchar,
  "version_testimonial_preview_description" varchar,
  "version_testimonial_preview_image_id" integer,
  "version_testimonial" jsonb,
  "version_client_name" varchar,
  "version_client_position" varchar,
  "version_client_company" varchar,
  "version_client_company_website" varchar,
  "version_client_location" varchar,
  "version_project_context" varchar,
  "version_service_id" integer,
  "version_case_study_id" integer,
  "version_testimonial_type" "enum__tstm_v_version_testimonial_type",
  "version_source_type" "enum__tstm_v_version_source_type",
  "version_source_url" varchar,
  "version_verified" boolean DEFAULT false,
  "version_meta_title" varchar,
  "version_meta_image_id" integer,
  "version_meta_description" varchar,
  "version_testimonial_date" timestamp(3) with time zone,
  "version_rating" "enum__tstm_v_version_rating",
  "version_published_at" timestamp(3) with time zone,
  "version_generate_slug" boolean DEFAULT true,
  "version_slug" varchar,
  "version_updated_at" timestamp(3) with time zone,
  "version_created_at" timestamp(3) with time zone,
  "version__status" "enum__tstm_v_version_status" DEFAULT 'draft',
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "latest" boolean,
  "autosave" boolean
);

DO $$ BEGIN
  ALTER TABLE "_tstm_v" ADD CONSTRAINT "_tstm_v_parent_id_tstm_id_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."tstm"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_tstm_v" ADD CONSTRAINT "_tstm_v_version_testimonial_preview_image_id_media_id_fk"
    FOREIGN KEY ("version_testimonial_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_tstm_v" ADD CONSTRAINT "_tstm_v_version_meta_image_id_media_id_fk"
    FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_tstm_v" ADD CONSTRAINT "_tstm_v_version_service_id_svc_id_fk"
    FOREIGN KEY ("version_service_id") REFERENCES "public"."svc"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_tstm_v" ADD CONSTRAINT "_tstm_v_version_case_study_id_cs_id_fk"
    FOREIGN KEY ("version_case_study_id") REFERENCES "public"."cs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "_tstm_v_parent_idx" ON "_tstm_v" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_testimonial_preview_image_idx" ON "_tstm_v" USING btree ("version_testimonial_preview_image_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_meta_image_idx" ON "_tstm_v" USING btree ("version_meta_image_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_service_idx" ON "_tstm_v" USING btree ("version_service_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_case_study_idx" ON "_tstm_v" USING btree ("version_case_study_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_slug_idx" ON "_tstm_v" USING btree ("version_slug");
CREATE INDEX IF NOT EXISTS "_tstm_v_updated_at_idx" ON "_tstm_v" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "_tstm_v_created_at_idx" ON "_tstm_v" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "_tstm_v_latest_idx" ON "_tstm_v" USING btree ("latest");
CREATE INDEX IF NOT EXISTS "_tstm_v_autosave_idx" ON "_tstm_v" USING btree ("autosave");
CREATE INDEX IF NOT EXISTS "_tstm_v_version_version_status_idx" ON "_tstm_v" USING btree ("version__status");

CREATE TABLE IF NOT EXISTS "tstm_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "site_categories_id" integer
);
CREATE INDEX IF NOT EXISTS "tstm_rels_order_idx" ON "tstm_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "tstm_rels_parent_idx" ON "tstm_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "tstm_rels_path_idx" ON "tstm_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "tstm_rels_site_categories_id_idx" ON "tstm_rels" USING btree ("site_categories_id");
DO $$ BEGIN
  ALTER TABLE "tstm_rels" ADD CONSTRAINT "tstm_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."tstm"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "tstm_rels" ADD CONSTRAINT "tstm_rels_site_categories_fk"
    FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_tstm_v_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "site_categories_id" integer
);
CREATE INDEX IF NOT EXISTS "_tstm_v_rels_order_idx" ON "_tstm_v_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "_tstm_v_rels_parent_idx" ON "_tstm_v_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_tstm_v_rels_path_idx" ON "_tstm_v_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "_tstm_v_rels_site_categories_id_idx" ON "_tstm_v_rels" USING btree ("site_categories_id");
DO $$ BEGIN
  ALTER TABLE "_tstm_v_rels" ADD CONSTRAINT "_tstm_v_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."_tstm_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_tstm_v_rels" ADD CONSTRAINT "_tstm_v_rels_site_categories_fk"
    FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "tstm_id" integer;
ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "tstm_id" integer;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tstm_id_idx"
  ON "payload_locked_documents_rels" USING btree ("tstm_id");
CREATE INDEX IF NOT EXISTS "redirects_rels_tstm_id_idx"
  ON "redirects_rels" USING btree ("tstm_id");
DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk"
    FOREIGN KEY ("tstm_id") REFERENCES "public"."tstm"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "redirects_rels"
    ADD CONSTRAINT "redirects_rels_testimonials_fk"
    FOREIGN KEY ("tstm_id") REFERENCES "public"."tstm"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payload_migrations (name, batch)
SELECT '20260930_testimonials', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260930_testimonials'
);
`

const apply = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')

    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public' AND (
        table_name = 'tstm'
        OR table_name LIKE 'tstm%'
        OR table_name LIKE '_tstm%'
      )
      ORDER BY table_name
    `)

    console.log(
      JSON.stringify(
        {
          ok: true,
          message: 'Testimonials schema applied (non-interactive SQL)',
          tables: tables.rows.map((row) => row.table_name),
        },
        null,
        2,
      ),
    )
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

void apply().catch((error) => {
  console.error(error)
  process.exit(1)
})
