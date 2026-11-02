import 'dotenv/config'
import pg from 'pg'

/**
 * Non-interactive schema for Industries (`dbName: ind`).
 * Draft autosave keeps text and select columns nullable.
 */
const rich = [
  'industry_overview',
  'manufacturing_processes',
  'products_and_applications',
  'materials_and_technologies',
  'target_markets',
  'buyer_types',
  'decision_makers',
  'buyer_requirements',
  'purchasing_factors',
  'marketing_challenges',
  'digital_market_specifics',
  'competitive_factors',
  'lead_generation_challenges',
  'search_behavior',
  'seo_strategy',
  'ai_search_strategy',
  'keyword_and_topic_structure',
  'authority_and_visibility',
  'content_strategy',
  'technical_content',
  'product_and_application_content',
  'expertise_content',
  'content_formats',
  'buyer_journey',
  'sales_cycle_characteristics',
  'buyer_questions_by_stage',
  'trust_and_conversion_factors',
  'lead_nurturing_approach',
  'website_and_catalog_strategy',
  'paid_advertising_strategy',
  'conversion_optimization',
  'analytics_and_measurement',
  'industry_expertise',
  'relevant_experience',
  'industry_proof_points',
]

const liveRich = rich.map((name) => `"${name}" jsonb`).join(',\n  ')
const versionRich = rich.map((name) => `"version_${name}" jsonb`).join(',\n  ')

const sql = `
DO $$ BEGIN
  CREATE TYPE "enum_ind_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__ind_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_ind_industry_level" AS ENUM('primary', 'secondary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__ind_v_version_industry_level" AS ENUM('primary', 'secondary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_indCases_relevance" AS ENUM('direct', 'related_manufacturing', 'related_product');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__indCases_v_relevance" AS ENUM('direct', 'related_manufacturing', 'related_product');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ind" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar,
  "industry_long_title" varchar,
  "industry_level" "enum_ind_industry_level" DEFAULT 'primary',
  "parent_industry_id" integer,
  "display_order" numeric,
  "featured" boolean DEFAULT false,
  "industry_preview_description" varchar,
  "industry_preview_image_id" integer,
  ${liveRich},
  "cta_title" varchar,
  "cta_description" varchar,
  "cta_button_label" varchar,
  "cta_button_url" varchar,
  "meta_title" varchar,
  "meta_image_id" integer,
  "meta_description" varchar,
  "published_at" timestamp(3) with time zone,
  "generate_slug" boolean DEFAULT true,
  "slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "_status" "enum_ind_status" DEFAULT 'draft'
);

DO $$ BEGIN
  ALTER TABLE "ind" ADD CONSTRAINT "ind_parent_industry_id_ind_id_fk"
    FOREIGN KEY ("parent_industry_id") REFERENCES "public"."ind"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "ind" ADD CONSTRAINT "ind_industry_preview_image_id_media_id_fk"
    FOREIGN KEY ("industry_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "ind" ADD CONSTRAINT "ind_meta_image_id_media_id_fk"
    FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "ind_parent_industry_idx" ON "ind" USING btree ("parent_industry_id");
CREATE INDEX IF NOT EXISTS "ind_industry_preview_image_idx" ON "ind" USING btree ("industry_preview_image_id");
CREATE INDEX IF NOT EXISTS "ind_meta_image_idx" ON "ind" USING btree ("meta_image_id");
CREATE INDEX IF NOT EXISTS "ind_slug_idx" ON "ind" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "ind_updated_at_idx" ON "ind" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "ind_created_at_idx" ON "ind" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "ind_status_idx" ON "ind" USING btree ("_status");

CREATE TABLE IF NOT EXISTS "_ind_v" (
  "id" serial PRIMARY KEY NOT NULL,
  "parent_id" integer,
  "version_title" varchar,
  "version_industry_long_title" varchar,
  "version_industry_level" "enum__ind_v_version_industry_level" DEFAULT 'primary',
  "version_parent_industry_id" integer,
  "version_display_order" numeric,
  "version_featured" boolean DEFAULT false,
  "version_industry_preview_description" varchar,
  "version_industry_preview_image_id" integer,
  ${versionRich},
  "version_cta_title" varchar,
  "version_cta_description" varchar,
  "version_cta_button_label" varchar,
  "version_cta_button_url" varchar,
  "version_meta_title" varchar,
  "version_meta_image_id" integer,
  "version_meta_description" varchar,
  "version_published_at" timestamp(3) with time zone,
  "version_generate_slug" boolean DEFAULT true,
  "version_slug" varchar,
  "version_updated_at" timestamp(3) with time zone,
  "version_created_at" timestamp(3) with time zone,
  "version__status" "enum__ind_v_version_status" DEFAULT 'draft',
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "latest" boolean,
  "autosave" boolean
);

DO $$ BEGIN
  ALTER TABLE "_ind_v" ADD CONSTRAINT "_ind_v_parent_id_ind_id_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."ind"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_ind_v" ADD CONSTRAINT "_ind_v_version_parent_industry_id_ind_id_fk"
    FOREIGN KEY ("version_parent_industry_id") REFERENCES "public"."ind"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_ind_v" ADD CONSTRAINT "_ind_v_version_industry_preview_image_id_media_id_fk"
    FOREIGN KEY ("version_industry_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_ind_v" ADD CONSTRAINT "_ind_v_version_meta_image_id_media_id_fk"
    FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "_ind_v_parent_idx" ON "_ind_v" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_ind_v_version_version_parent_industry_idx" ON "_ind_v" USING btree ("version_parent_industry_id");
CREATE INDEX IF NOT EXISTS "_ind_v_version_version_industry_preview_image_idx" ON "_ind_v" USING btree ("version_industry_preview_image_id");
CREATE INDEX IF NOT EXISTS "_ind_v_version_version_meta_image_idx" ON "_ind_v" USING btree ("version_meta_image_id");
CREATE INDEX IF NOT EXISTS "_ind_v_version_version_slug_idx" ON "_ind_v" USING btree ("version_slug");
CREATE INDEX IF NOT EXISTS "_ind_v_created_at_idx" ON "_ind_v" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "_ind_v_updated_at_idx" ON "_ind_v" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "_ind_v_latest_idx" ON "_ind_v" USING btree ("latest");
CREATE INDEX IF NOT EXISTS "_ind_v_autosave_idx" ON "_ind_v" USING btree ("autosave");
CREATE INDEX IF NOT EXISTS "_ind_v_version_version_status_idx" ON "_ind_v" USING btree ("version__status");

CREATE TABLE IF NOT EXISTS "indCases" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "case_study_id" integer,
  "relevance" "enum_indCases_relevance",
  "relevance_note" varchar
);
CREATE INDEX IF NOT EXISTS "indCases_order_idx" ON "indCases" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "indCases_parent_id_idx" ON "indCases" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "indCases_case_study_idx" ON "indCases" USING btree ("case_study_id");
DO $$ BEGIN
  ALTER TABLE "indCases" ADD CONSTRAINT "indCases_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "indCases" ADD CONSTRAINT "indCases_case_study_id_cs_id_fk"
    FOREIGN KEY ("case_study_id") REFERENCES "public"."cs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_indCases_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "case_study_id" integer,
  "relevance" "enum__indCases_v_relevance",
  "relevance_note" varchar
);
CREATE INDEX IF NOT EXISTS "_indCases_v_order_idx" ON "_indCases_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_indCases_v_parent_id_idx" ON "_indCases_v" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_indCases_v_case_study_idx" ON "_indCases_v" USING btree ("case_study_id");
DO $$ BEGIN
  ALTER TABLE "_indCases_v" ADD CONSTRAINT "_indCases_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_ind_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_indCases_v" ADD CONSTRAINT "_indCases_v_case_study_id_cs_id_fk"
    FOREIGN KEY ("case_study_id") REFERENCES "public"."cs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "indFaq" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "question" varchar,
  "answer" jsonb
);
CREATE INDEX IF NOT EXISTS "indFaq_order_idx" ON "indFaq" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "indFaq_parent_id_idx" ON "indFaq" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "indFaq" ADD CONSTRAINT "indFaq_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_indFaq_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "question" varchar,
  "answer" jsonb
);
CREATE INDEX IF NOT EXISTS "_indFaq_v_order_idx" ON "_indFaq_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_indFaq_v_parent_id_idx" ON "_indFaq_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_indFaq_v" ADD CONSTRAINT "_indFaq_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_ind_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ind_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "svc_id" integer,
  "posts_id" integer
);
CREATE INDEX IF NOT EXISTS "ind_rels_order_idx" ON "ind_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "ind_rels_parent_idx" ON "ind_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "ind_rels_path_idx" ON "ind_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "ind_rels_svc_id_idx" ON "ind_rels" USING btree ("svc_id");
CREATE INDEX IF NOT EXISTS "ind_rels_posts_id_idx" ON "ind_rels" USING btree ("posts_id");
DO $$ BEGIN
  ALTER TABLE "ind_rels" ADD CONSTRAINT "ind_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "ind_rels" ADD CONSTRAINT "ind_rels_svc_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "ind_rels" ADD CONSTRAINT "ind_rels_posts_fk"
    FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_ind_v_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "svc_id" integer,
  "posts_id" integer
);
CREATE INDEX IF NOT EXISTS "_ind_v_rels_order_idx" ON "_ind_v_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "_ind_v_rels_parent_idx" ON "_ind_v_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_ind_v_rels_path_idx" ON "_ind_v_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "_ind_v_rels_svc_id_idx" ON "_ind_v_rels" USING btree ("svc_id");
CREATE INDEX IF NOT EXISTS "_ind_v_rels_posts_id_idx" ON "_ind_v_rels" USING btree ("posts_id");
DO $$ BEGIN
  ALTER TABLE "_ind_v_rels" ADD CONSTRAINT "_ind_v_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."_ind_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_ind_v_rels" ADD CONSTRAINT "_ind_v_rels_svc_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_ind_v_rels" ADD CONSTRAINT "_ind_v_rels_posts_fk"
    FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "ind_id" integer;
ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "ind_id" integer;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ind_id_idx"
  ON "payload_locked_documents_rels" USING btree ("ind_id");
CREATE INDEX IF NOT EXISTS "redirects_rels_ind_id_idx"
  ON "redirects_rels" USING btree ("ind_id");
DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_industries_fk"
    FOREIGN KEY ("ind_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "redirects_rels"
    ADD CONSTRAINT "redirects_rels_industries_fk"
    FOREIGN KEY ("ind_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "indPlans" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar,
  "slug" varchar,
  "preview_description" varchar,
  "preview_image_id" integer,
  "display_order" numeric
);
CREATE INDEX IF NOT EXISTS "indPlans_order_idx" ON "indPlans" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "indPlans_parent_id_idx" ON "indPlans" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "indPlans_preview_image_idx" ON "indPlans" USING btree ("preview_image_id");
DO $$ BEGIN
  ALTER TABLE "indPlans" ADD CONSTRAINT "indPlans_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."ind"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "indPlans" ADD CONSTRAINT "indPlans_preview_image_id_media_id_fk"
    FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_indPlans_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "title" varchar,
  "slug" varchar,
  "preview_description" varchar,
  "preview_image_id" integer,
  "display_order" numeric
);
CREATE INDEX IF NOT EXISTS "_indPlans_v_order_idx" ON "_indPlans_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_indPlans_v_parent_id_idx" ON "_indPlans_v" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_indPlans_v_preview_image_idx" ON "_indPlans_v" USING btree ("preview_image_id");
DO $$ BEGIN
  ALTER TABLE "_indPlans_v" ADD CONSTRAINT "_indPlans_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_ind_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_indPlans_v" ADD CONSTRAINT "_indPlans_v_preview_image_id_media_id_fk"
    FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payload_migrations (name, batch)
SELECT '20261102_industries', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20261102_industries'
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
      WHERE table_schema = 'public' AND (
        table_name = 'ind' OR table_name LIKE 'ind%' OR table_name LIKE '_ind%'
      )
      ORDER BY table_name
    `)
    console.log(JSON.stringify({ ok: true, tables: tables.rows.map((row) => row.table_name) }, null, 2))
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
