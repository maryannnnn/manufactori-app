import 'dotenv/config'
import pg from 'pg'

/**
 * Fix array table names to match Payload dbName conventions:
 * live: {dbName}   versions: _{dbName}_v
 * (same pattern as blocks: csPrev / _csPrev_v)
 */
const sql = `
-- Drop incorrectly named tables from previous apply
DROP TABLE IF EXISTS "_cs_v_version_nicheSeg" CASCADE;
DROP TABLE IF EXISTS "cs_nicheSeg" CASCADE;
DROP TABLE IF EXISTS "_cs_v_version_paidAds" CASCADE;
DROP TABLE IF EXISTS "cs_paidAds" CASCADE;
DROP TABLE IF EXISTS "_cs_v_version_socMed" CASCADE;
DROP TABLE IF EXISTS "cs_socMed" CASCADE;
DROP TABLE IF EXISTS "_cs_v_version_timeline" CASCADE;
DROP TABLE IF EXISTS "cs_timeline" CASCADE;
DROP TABLE IF EXISTS "_cs_v_version_metrics" CASCADE;
DROP TABLE IF EXISTS "cs_metrics" CASCADE;
DROP TABLE IF EXISTS "_cs_v_version_projShow" CASCADE;
DROP TABLE IF EXISTS "cs_projShow" CASCADE;

-- Version enums matching _{dbName}_v pattern
DO $$ BEGIN
  CREATE TYPE "enum__paidAds_v_channel" AS ENUM(
    'google_ads','microsoft_ads','yandex_direct','meta_ads','linkedin_ads','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__socMed_v_channel" AS ENUM(
    'linkedin','facebook','instagram','youtube','tiktok','telegram','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- nicheSeg
CREATE TABLE IF NOT EXISTS "nicheSeg" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "description" jsonb,
  "marketing_approach" jsonb
);
CREATE INDEX IF NOT EXISTS "nicheSeg_order_idx" ON "nicheSeg" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "nicheSeg_parent_id_idx" ON "nicheSeg" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "nicheSeg" ADD CONSTRAINT "nicheSeg_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_nicheSeg_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "name" varchar,
  "description" jsonb,
  "marketing_approach" jsonb
);
CREATE INDEX IF NOT EXISTS "_nicheSeg_v_order_idx" ON "_nicheSeg_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_nicheSeg_v_parent_id_idx" ON "_nicheSeg_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_nicheSeg_v" ADD CONSTRAINT "_nicheSeg_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- paidAds
CREATE TABLE IF NOT EXISTS "paidAds" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "channel" "enum_paidAds_channel",
  "strategy" jsonb,
  "campaign_structure" jsonb,
  "results" jsonb
);
CREATE INDEX IF NOT EXISTS "paidAds_order_idx" ON "paidAds" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "paidAds_parent_id_idx" ON "paidAds" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "paidAds" ADD CONSTRAINT "paidAds_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_paidAds_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "channel" "enum__paidAds_v_channel",
  "strategy" jsonb,
  "campaign_structure" jsonb,
  "results" jsonb
);
CREATE INDEX IF NOT EXISTS "_paidAds_v_order_idx" ON "_paidAds_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_paidAds_v_parent_id_idx" ON "_paidAds_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_paidAds_v" ADD CONSTRAINT "_paidAds_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- socMed
CREATE TABLE IF NOT EXISTS "socMed" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "channel" "enum_socMed_channel",
  "strategy" jsonb,
  "content" jsonb,
  "results" jsonb
);
CREATE INDEX IF NOT EXISTS "socMed_order_idx" ON "socMed" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "socMed_parent_id_idx" ON "socMed" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "socMed" ADD CONSTRAINT "socMed_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_socMed_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "channel" "enum__socMed_v_channel",
  "strategy" jsonb,
  "content" jsonb,
  "results" jsonb
);
CREATE INDEX IF NOT EXISTS "_socMed_v_order_idx" ON "_socMed_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_socMed_v_parent_id_idx" ON "_socMed_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_socMed_v" ADD CONSTRAINT "_socMed_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- timeline
CREATE TABLE IF NOT EXISTS "timeline" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "period" varchar,
  "title" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "timeline_order_idx" ON "timeline" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "timeline_parent_id_idx" ON "timeline" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "timeline" ADD CONSTRAINT "timeline_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_timeline_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "period" varchar,
  "title" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "_timeline_v_order_idx" ON "_timeline_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_timeline_v_parent_id_idx" ON "_timeline_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_timeline_v" ADD CONSTRAINT "_timeline_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- metrics
CREATE TABLE IF NOT EXISTS "metrics" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "value" varchar,
  "label" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "metrics_order_idx" ON "metrics" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "metrics_parent_id_idx" ON "metrics" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "metrics" ADD CONSTRAINT "metrics_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_metrics_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "value" varchar,
  "label" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "_metrics_v_order_idx" ON "_metrics_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_metrics_v_parent_id_idx" ON "_metrics_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_metrics_v" ADD CONSTRAINT "_metrics_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- projShow
CREATE TABLE IF NOT EXISTS "projShow" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "project_name" varchar,
  "description" jsonb,
  "image_id" integer,
  "url" varchar
);
CREATE INDEX IF NOT EXISTS "projShow_order_idx" ON "projShow" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "projShow_parent_id_idx" ON "projShow" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "projShow_image_idx" ON "projShow" USING btree ("image_id");
DO $$ BEGIN
  ALTER TABLE "projShow" ADD CONSTRAINT "projShow_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "projShow" ADD CONSTRAINT "projShow_image_id_fk"
    FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_projShow_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "project_name" varchar,
  "description" jsonb,
  "image_id" integer,
  "url" varchar
);
CREATE INDEX IF NOT EXISTS "_projShow_v_order_idx" ON "_projShow_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_projShow_v_parent_id_idx" ON "_projShow_v" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_projShow_v_image_idx" ON "_projShow_v" USING btree ("image_id");
DO $$ BEGIN
  ALTER TABLE "_projShow_v" ADD CONSTRAINT "_projShow_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_cs_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_projShow_v" ADD CONSTRAINT "_projShow_v_image_id_fk"
    FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`

const apply = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const client = await pool.connect()
  try {
    const before = await client.query(`
      SELECT
        (SELECT COUNT(*)::int FROM cs) AS cs_count,
        (SELECT COUNT(*)::int FROM _cs_v) AS versions_count
    `)
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    const after = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public' AND table_name IN (
        'nicheSeg','_nicheSeg_v','paidAds','_paidAds_v','socMed','_socMed_v',
        'timeline','_timeline_v','metrics','_metrics_v','projShow','_projShow_v'
      )
      ORDER BY table_name
    `)
    console.log(
      JSON.stringify(
        {
          ok: true,
          data: before.rows[0],
          tables: after.rows.map((r) => r.table_name),
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
