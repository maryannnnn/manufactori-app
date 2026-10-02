import 'dotenv/config'
import pg from 'pg'

/**
 * Non-interactive schema apply for the Services collection (`dbName: svc`).
 * Matches Payload postgres naming used by Case Studies (`cs`) and Posts.
 */
const sql = `
-- Enums
DO $$ BEGIN
  CREATE TYPE "enum_svc_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svc_working_format_minimum_engagement" AS ENUM(
    'one_time_project','1_month','3_months','6_months','1_year','ongoing'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_version_working_format_minimum_engagement" AS ENUM(
    'one_time_project','1_month','3_months','6_months','1_year','ongoing'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svcFmt_format" AS ENUM('initial_project','ongoing_monthly','campaign');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_svcFmt_duration" AS ENUM(
    'one_time_project','1_month','3_months','6_months','1_year','ongoing'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svcFmt_v_format" AS ENUM('initial_project','ongoing_monthly','campaign');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svcFmt_v_duration" AS ENUM(
    'one_time_project','1_month','3_months','6_months','1_year','ongoing'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_archive_populate_by" AS ENUM('collection', 'selection');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_archive_relation_to" AS ENUM('posts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_archive_relation_to" AS ENUM('posts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_svc_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum__svc_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Main collection
CREATE TABLE IF NOT EXISTS "svc" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar,
  "service_long_title" varchar,
  "service_preview_title" varchar,
  "service_preview_description" varchar,
  "service_preview_image_id" integer,
  "service_content_title" varchar,
  "introduction_text" jsonb,
  "introduction_supporting_text" jsonb,
  "entry_offer_title" varchar,
  "entry_offer_description" jsonb,
  "entry_offer_includes" jsonb,
  "entry_offer_duration" varchar,
  "entry_offer_deliverables" jsonb,
  "entry_offer_price" varchar,
  "entry_offer_cta_label" varchar,
  "entry_offer_cta_url" varchar,
  "entry_offer_next_step" jsonb,
  "working_format_minimum_engagement" "enum_svc_working_format_minimum_engagement",
  "working_format_frequency" varchar,
  "client_testimonial_quote" jsonb,
  "client_testimonial_author" varchar,
  "client_testimonial_position" varchar,
  "client_testimonial_company" varchar,
  "faq_title" varchar,
  "faq_intro" jsonb,
  "meta_title" varchar,
  "meta_image_id" integer,
  "meta_description" varchar,
  "featured" boolean DEFAULT false,
  "display_order" numeric,
  "published_at" timestamp(3) with time zone,
  "generate_slug" boolean DEFAULT true,
  "slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "_status" "enum_svc_status" DEFAULT 'draft'
);

DO $$ BEGIN
  ALTER TABLE "svc" ADD CONSTRAINT "svc_service_preview_image_id_media_id_fk"
    FOREIGN KEY ("service_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc" ADD CONSTRAINT "svc_meta_image_id_media_id_fk"
    FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "svc_service_preview_image_idx" ON "svc" USING btree ("service_preview_image_id");
CREATE INDEX IF NOT EXISTS "svc_meta_image_idx" ON "svc" USING btree ("meta_image_id");
CREATE UNIQUE INDEX IF NOT EXISTS "svc_slug_idx" ON "svc" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "svc_updated_at_idx" ON "svc" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "svc_created_at_idx" ON "svc" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "svc_status_idx" ON "svc" USING btree ("_status");

-- Versions
CREATE TABLE IF NOT EXISTS "_svc_v" (
  "id" serial PRIMARY KEY NOT NULL,
  "parent_id" integer,
  "version_title" varchar,
  "version_service_long_title" varchar,
  "version_service_preview_title" varchar,
  "version_service_preview_description" varchar,
  "version_service_preview_image_id" integer,
  "version_service_content_title" varchar,
  "version_introduction_text" jsonb,
  "version_introduction_supporting_text" jsonb,
  "version_entry_offer_title" varchar,
  "version_entry_offer_description" jsonb,
  "version_entry_offer_includes" jsonb,
  "version_entry_offer_duration" varchar,
  "version_entry_offer_deliverables" jsonb,
  "version_entry_offer_price" varchar,
  "version_entry_offer_cta_label" varchar,
  "version_entry_offer_cta_url" varchar,
  "version_entry_offer_next_step" jsonb,
  "version_working_format_minimum_engagement" "enum__svc_v_version_working_format_minimum_engagement",
  "version_working_format_frequency" varchar,
  "version_client_testimonial_quote" jsonb,
  "version_client_testimonial_author" varchar,
  "version_client_testimonial_position" varchar,
  "version_client_testimonial_company" varchar,
  "version_faq_title" varchar,
  "version_faq_intro" jsonb,
  "version_meta_title" varchar,
  "version_meta_image_id" integer,
  "version_meta_description" varchar,
  "version_featured" boolean DEFAULT false,
  "version_display_order" numeric,
  "version_published_at" timestamp(3) with time zone,
  "version_generate_slug" boolean DEFAULT true,
  "version_slug" varchar,
  "version_updated_at" timestamp(3) with time zone,
  "version_created_at" timestamp(3) with time zone,
  "version__status" "enum__svc_v_version_status" DEFAULT 'draft',
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "latest" boolean,
  "autosave" boolean
);

DO $$ BEGIN
  ALTER TABLE "_svc_v" ADD CONSTRAINT "_svc_v_parent_id_svc_id_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."svc"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v" ADD CONSTRAINT "_svc_v_version_service_preview_image_id_media_id_fk"
    FOREIGN KEY ("version_service_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v" ADD CONSTRAINT "_svc_v_version_meta_image_id_media_id_fk"
    FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "_svc_v_parent_idx" ON "_svc_v" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_version_version_service_preview_image_idx" ON "_svc_v" USING btree ("version_service_preview_image_id");
CREATE INDEX IF NOT EXISTS "_svc_v_version_version_meta_image_idx" ON "_svc_v" USING btree ("version_meta_image_id");
CREATE INDEX IF NOT EXISTS "_svc_v_version_version_slug_idx" ON "_svc_v" USING btree ("version_slug");
CREATE INDEX IF NOT EXISTS "_svc_v_updated_at_idx" ON "_svc_v" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "_svc_v_created_at_idx" ON "_svc_v" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "_svc_v_latest_idx" ON "_svc_v" USING btree ("latest");
CREATE INDEX IF NOT EXISTS "_svc_v_autosave_idx" ON "_svc_v" USING btree ("autosave");
CREATE INDEX IF NOT EXISTS "_svc_v_version_version_status_idx" ON "_svc_v" USING btree ("version__status");

-- Arrays (live: {dbName}, versions: _{dbName}_v)
CREATE TABLE IF NOT EXISTS "svcSit" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar,
  "description" jsonb,
  "consequence" jsonb,
  "recommended_approach" jsonb
);
CREATE INDEX IF NOT EXISTS "svcSit_order_idx" ON "svcSit" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcSit_parent_id_idx" ON "svcSit" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcSit" ADD CONSTRAINT "svcSit_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcSit_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "title" varchar,
  "description" jsonb,
  "consequence" jsonb,
  "recommended_approach" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcSit_v_order_idx" ON "_svcSit_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcSit_v_parent_id_idx" ON "_svcSit_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcSit_v" ADD CONSTRAINT "_svcSit_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcScope" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar,
  "description" jsonb,
  "deliverables" jsonb,
  "approach" jsonb
);
CREATE INDEX IF NOT EXISTS "svcScope_order_idx" ON "svcScope" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcScope_parent_id_idx" ON "svcScope" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcScope" ADD CONSTRAINT "svcScope_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcScope_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "title" varchar,
  "description" jsonb,
  "deliverables" jsonb,
  "approach" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcScope_v_order_idx" ON "_svcScope_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcScope_v_parent_id_idx" ON "_svcScope_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcScope_v" ADD CONSTRAINT "_svcScope_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcProc" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "step_number" numeric,
  "title" varchar,
  "description" jsonb,
  "duration" varchar,
  "deliverable" jsonb,
  "client_involvement" jsonb
);
CREATE INDEX IF NOT EXISTS "svcProc_order_idx" ON "svcProc" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcProc_parent_id_idx" ON "svcProc" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcProc" ADD CONSTRAINT "svcProc_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcProc_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "step_number" numeric,
  "title" varchar,
  "description" jsonb,
  "duration" varchar,
  "deliverable" jsonb,
  "client_involvement" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcProc_v_order_idx" ON "_svcProc_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcProc_v_parent_id_idx" ON "_svcProc_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcProc_v" ADD CONSTRAINT "_svcProc_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcFmt" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "format" "enum_svcFmt_format",
  "duration" "enum_svcFmt_duration",
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "svcFmt_order_idx" ON "svcFmt" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcFmt_parent_id_idx" ON "svcFmt" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcFmt" ADD CONSTRAINT "svcFmt_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcFmt_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "format" "enum__svcFmt_v_format",
  "duration" "enum__svcFmt_v_duration",
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcFmt_v_order_idx" ON "_svcFmt_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcFmt_v_parent_id_idx" ON "_svcFmt_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcFmt_v" ADD CONSTRAINT "_svcFmt_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcOut" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "title" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "svcOut_order_idx" ON "svcOut" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcOut_parent_id_idx" ON "svcOut" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcOut" ADD CONSTRAINT "svcOut_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcOut_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "title" varchar,
  "description" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcOut_v_order_idx" ON "_svcOut_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcOut_v_parent_id_idx" ON "_svcOut_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcOut_v" ADD CONSTRAINT "_svcOut_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcFaq" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "question" varchar,
  "answer" jsonb
);
CREATE INDEX IF NOT EXISTS "svcFaq_order_idx" ON "svcFaq" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcFaq_parent_id_idx" ON "svcFaq" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcFaq" ADD CONSTRAINT "svcFaq_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcFaq_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "question" varchar,
  "answer" jsonb
);
CREATE INDEX IF NOT EXISTS "_svcFaq_v_order_idx" ON "_svcFaq_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcFaq_v_parent_id_idx" ON "_svcFaq_v" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcFaq_v" ADD CONSTRAINT "_svcFaq_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Populated authors
CREATE TABLE IF NOT EXISTS "svc_populated_authors" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar NOT NULL,
  "name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_populated_authors_order_idx" ON "svc_populated_authors" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_populated_authors_parent_id_idx" ON "svc_populated_authors" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svc_populated_authors" ADD CONSTRAINT "svc_populated_authors_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_version_populated_authors" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_version_populated_authors_order_idx" ON "_svc_v_version_populated_authors" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_version_populated_authors_parent_id_idx" ON "_svc_v_version_populated_authors" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svc_v_version_populated_authors" ADD CONSTRAINT "_svc_v_version_populated_authors_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Custom layout blocks
CREATE TABLE IF NOT EXISTS "svcGal" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "service_gallery_title" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svcGal_order_idx" ON "svcGal" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcGal_parent_id_idx" ON "svcGal" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svcGal_path_idx" ON "svcGal" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svcGal" ADD CONSTRAINT "svcGal_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcGal_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "service_gallery_title" varchar,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svcGal_v_order_idx" ON "_svcGal_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcGal_v_parent_id_idx" ON "_svcGal_v" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svcGal_v_path_idx" ON "_svcGal_v" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svcGal_v" ADD CONSTRAINT "_svcGal_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcCom" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "service_comment_title" varchar,
  "service_comment_text" jsonb,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svcCom_order_idx" ON "svcCom" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcCom_parent_id_idx" ON "svcCom" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svcCom_path_idx" ON "svcCom" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svcCom" ADD CONSTRAINT "svcCom_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcCom_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "service_comment_title" varchar,
  "service_comment_text" jsonb,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svcCom_v_order_idx" ON "_svcCom_v" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcCom_v_parent_id_idx" ON "_svcCom_v" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svcCom_v_path_idx" ON "_svcCom_v" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svcCom_v" ADD CONSTRAINT "_svcCom_v_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svcCom_comments" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "author" varchar,
  "role" varchar,
  "date" timestamp(3) with time zone,
  "depth" numeric DEFAULT 0,
  "is_expert" boolean DEFAULT false,
  "body" jsonb
);
CREATE INDEX IF NOT EXISTS "svcCom_comments_order_idx" ON "svcCom_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svcCom_comments_parent_id_idx" ON "svcCom_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svcCom_comments" ADD CONSTRAINT "svcCom_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svcCom"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svcCom_v_comments" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "author" varchar,
  "role" varchar,
  "date" timestamp(3) with time zone,
  "depth" numeric DEFAULT 0,
  "is_expert" boolean DEFAULT false,
  "body" jsonb,
  "_uuid" varchar
);
CREATE INDEX IF NOT EXISTS "_svcCom_v_comments_order_idx" ON "_svcCom_v_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svcCom_v_comments_parent_id_idx" ON "_svcCom_v_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svcCom_v_comments" ADD CONSTRAINT "_svcCom_v_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svcCom_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Shared layout blocks
CREATE TABLE IF NOT EXISTS "svc_blocks_cta" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "rich_text" jsonb,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_blocks_cta_order_idx" ON "svc_blocks_cta" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_cta_parent_id_idx" ON "svc_blocks_cta" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svc_blocks_cta_path_idx" ON "svc_blocks_cta" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_cta" ADD CONSTRAINT "svc_blocks_cta_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_cta_links" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "link_type" "enum_svc_blocks_cta_links_link_type" DEFAULT 'reference',
  "link_new_tab" boolean,
  "link_url" varchar,
  "link_label" varchar,
  "link_appearance" "enum_svc_blocks_cta_links_link_appearance" DEFAULT 'default'
);
CREATE INDEX IF NOT EXISTS "svc_blocks_cta_links_order_idx" ON "svc_blocks_cta_links" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_cta_links_parent_id_idx" ON "svc_blocks_cta_links" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_cta_links" ADD CONSTRAINT "svc_blocks_cta_links_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_cta" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "rich_text" jsonb,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_cta_order_idx" ON "_svc_v_blocks_cta" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_cta_parent_id_idx" ON "_svc_v_blocks_cta" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_cta_path_idx" ON "_svc_v_blocks_cta" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_cta" ADD CONSTRAINT "_svc_v_blocks_cta_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_cta_links" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "link_type" "enum__svc_v_blocks_cta_links_link_type" DEFAULT 'reference',
  "link_new_tab" boolean,
  "link_url" varchar,
  "link_label" varchar,
  "link_appearance" "enum__svc_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  "_uuid" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_cta_links_order_idx" ON "_svc_v_blocks_cta_links" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_cta_links_parent_id_idx" ON "_svc_v_blocks_cta_links" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_cta_links" ADD CONSTRAINT "_svc_v_blocks_cta_links_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_content" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_blocks_content_order_idx" ON "svc_blocks_content" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_content_parent_id_idx" ON "svc_blocks_content" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svc_blocks_content_path_idx" ON "svc_blocks_content" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_content" ADD CONSTRAINT "svc_blocks_content_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_content_columns" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "size" "enum_svc_blocks_content_columns_size" DEFAULT 'oneThird',
  "rich_text" jsonb,
  "enable_link" boolean,
  "link_type" "enum_svc_blocks_content_columns_link_type" DEFAULT 'reference',
  "link_new_tab" boolean,
  "link_url" varchar,
  "link_label" varchar,
  "link_appearance" "enum_svc_blocks_content_columns_link_appearance" DEFAULT 'default'
);
CREATE INDEX IF NOT EXISTS "svc_blocks_content_columns_order_idx" ON "svc_blocks_content_columns" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_content_columns_parent_id_idx" ON "svc_blocks_content_columns" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_content_columns" ADD CONSTRAINT "svc_blocks_content_columns_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_content" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_content_order_idx" ON "_svc_v_blocks_content" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_content_parent_id_idx" ON "_svc_v_blocks_content" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_content_path_idx" ON "_svc_v_blocks_content" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_content" ADD CONSTRAINT "_svc_v_blocks_content_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_content_columns" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "size" "enum__svc_v_blocks_content_columns_size" DEFAULT 'oneThird',
  "rich_text" jsonb,
  "enable_link" boolean,
  "link_type" "enum__svc_v_blocks_content_columns_link_type" DEFAULT 'reference',
  "link_new_tab" boolean,
  "link_url" varchar,
  "link_label" varchar,
  "link_appearance" "enum__svc_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  "_uuid" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_content_columns_order_idx" ON "_svc_v_blocks_content_columns" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_content_columns_parent_id_idx" ON "_svc_v_blocks_content_columns" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_content_columns" ADD CONSTRAINT "_svc_v_blocks_content_columns_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_media_block" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "media_id" integer,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_blocks_media_block_order_idx" ON "svc_blocks_media_block" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_media_block_parent_id_idx" ON "svc_blocks_media_block" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svc_blocks_media_block_path_idx" ON "svc_blocks_media_block" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "svc_blocks_media_block_media_idx" ON "svc_blocks_media_block" USING btree ("media_id");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_media_block" ADD CONSTRAINT "svc_blocks_media_block_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_blocks_media_block" ADD CONSTRAINT "svc_blocks_media_block_media_id_media_id_fk"
    FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_media_block" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "media_id" integer,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_media_block_order_idx" ON "_svc_v_blocks_media_block" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_media_block_parent_id_idx" ON "_svc_v_blocks_media_block" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_media_block_path_idx" ON "_svc_v_blocks_media_block" USING btree ("_path");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_media_block_media_idx" ON "_svc_v_blocks_media_block" USING btree ("media_id");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_media_block" ADD CONSTRAINT "_svc_v_blocks_media_block_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_media_block" ADD CONSTRAINT "_svc_v_blocks_media_block_media_id_media_id_fk"
    FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_archive" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "intro_content" jsonb,
  "populate_by" "enum_svc_blocks_archive_populate_by" DEFAULT 'collection',
  "relation_to" "enum_svc_blocks_archive_relation_to" DEFAULT 'posts',
  "limit" numeric DEFAULT 10,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_blocks_archive_order_idx" ON "svc_blocks_archive" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_archive_parent_id_idx" ON "svc_blocks_archive" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svc_blocks_archive_path_idx" ON "svc_blocks_archive" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_archive" ADD CONSTRAINT "svc_blocks_archive_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_archive" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "intro_content" jsonb,
  "populate_by" "enum__svc_v_blocks_archive_populate_by" DEFAULT 'collection',
  "relation_to" "enum__svc_v_blocks_archive_relation_to" DEFAULT 'posts',
  "limit" numeric DEFAULT 10,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_archive_order_idx" ON "_svc_v_blocks_archive" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_archive_parent_id_idx" ON "_svc_v_blocks_archive" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_archive_path_idx" ON "_svc_v_blocks_archive" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_archive" ADD CONSTRAINT "_svc_v_blocks_archive_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "svc_blocks_code" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "language" "enum_svc_blocks_code_language" DEFAULT 'typescript',
  "code" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "svc_blocks_code_order_idx" ON "svc_blocks_code" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "svc_blocks_code_parent_id_idx" ON "svc_blocks_code" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "svc_blocks_code_path_idx" ON "svc_blocks_code" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "svc_blocks_code" ADD CONSTRAINT "svc_blocks_code_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_blocks_code" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" text NOT NULL,
  "id" serial PRIMARY KEY NOT NULL,
  "language" "enum__svc_v_blocks_code_language" DEFAULT 'typescript',
  "code" varchar,
  "_uuid" varchar,
  "block_name" varchar
);
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_code_order_idx" ON "_svc_v_blocks_code" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_code_parent_id_idx" ON "_svc_v_blocks_code" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_blocks_code_path_idx" ON "_svc_v_blocks_code" USING btree ("_path");
DO $$ BEGIN
  ALTER TABLE "_svc_v_blocks_code" ADD CONSTRAINT "_svc_v_blocks_code_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Relationships
CREATE TABLE IF NOT EXISTS "svc_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "pages_id" integer,
  "posts_id" integer,
  "media_id" integer,
  "categories_id" integer,
  "cs_id" integer,
  "site_categories_id" integer,
  "users_id" integer,
  "svc_id" integer
);
CREATE INDEX IF NOT EXISTS "svc_rels_order_idx" ON "svc_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "svc_rels_parent_idx" ON "svc_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "svc_rels_path_idx" ON "svc_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "svc_rels_pages_id_idx" ON "svc_rels" USING btree ("pages_id");
CREATE INDEX IF NOT EXISTS "svc_rels_posts_id_idx" ON "svc_rels" USING btree ("posts_id");
CREATE INDEX IF NOT EXISTS "svc_rels_media_id_idx" ON "svc_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "svc_rels_categories_id_idx" ON "svc_rels" USING btree ("categories_id");
CREATE INDEX IF NOT EXISTS "svc_rels_cs_id_idx" ON "svc_rels" USING btree ("cs_id");
CREATE INDEX IF NOT EXISTS "svc_rels_site_categories_id_idx" ON "svc_rels" USING btree ("site_categories_id");
CREATE INDEX IF NOT EXISTS "svc_rels_users_id_idx" ON "svc_rels" USING btree ("users_id");
CREATE INDEX IF NOT EXISTS "svc_rels_svc_id_idx" ON "svc_rels" USING btree ("svc_id");
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_pages_fk"
    FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_posts_fk"
    FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_media_fk"
    FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_categories_fk"
    FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_cs_fk"
    FOREIGN KEY ("cs_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_site_categories_fk"
    FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_users_fk"
    FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "svc_rels" ADD CONSTRAINT "svc_rels_svc_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_svc_v_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "pages_id" integer,
  "posts_id" integer,
  "media_id" integer,
  "categories_id" integer,
  "cs_id" integer,
  "site_categories_id" integer,
  "users_id" integer,
  "svc_id" integer
);
CREATE INDEX IF NOT EXISTS "_svc_v_rels_order_idx" ON "_svc_v_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_parent_idx" ON "_svc_v_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_path_idx" ON "_svc_v_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_pages_id_idx" ON "_svc_v_rels" USING btree ("pages_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_posts_id_idx" ON "_svc_v_rels" USING btree ("posts_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_media_id_idx" ON "_svc_v_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_categories_id_idx" ON "_svc_v_rels" USING btree ("categories_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_cs_id_idx" ON "_svc_v_rels" USING btree ("cs_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_site_categories_id_idx" ON "_svc_v_rels" USING btree ("site_categories_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_users_id_idx" ON "_svc_v_rels" USING btree ("users_id");
CREATE INDEX IF NOT EXISTS "_svc_v_rels_svc_id_idx" ON "_svc_v_rels" USING btree ("svc_id");
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."_svc_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_pages_fk"
    FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_posts_fk"
    FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_media_fk"
    FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_categories_fk"
    FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_cs_fk"
    FOREIGN KEY ("cs_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_site_categories_fk"
    FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_users_fk"
    FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "_svc_v_rels" ADD CONSTRAINT "_svc_v_rels_svc_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Shared lock / redirect wiring
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "svc_id" integer;
ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "svc_id" integer;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_svc_id_idx"
  ON "payload_locked_documents_rels" USING btree ("svc_id");
CREATE INDEX IF NOT EXISTS "redirects_rels_svc_id_idx"
  ON "redirects_rels" USING btree ("svc_id");
DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels"
    ADD CONSTRAINT "payload_locked_documents_rels_services_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "redirects_rels"
    ADD CONSTRAINT "redirects_rels_services_fk"
    FOREIGN KEY ("svc_id") REFERENCES "public"."svc"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Drafts autosave an empty document on /create. Payload required fields are
-- enforced in the CMS, not as DB NOT NULL (same as Case Study / Post).
ALTER TABLE "svc" ALTER COLUMN "title" DROP NOT NULL;
ALTER TABLE "_svc_v" ALTER COLUMN "version_title" DROP NOT NULL;

INSERT INTO payload_migrations (name, batch)
SELECT '20260929_services', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260929_services'
);
INSERT INTO payload_migrations (name, batch)
SELECT '20260929_services_draft_title', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260929_services_draft_title'
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
        table_name = 'svc'
        OR table_name LIKE 'svc%'
        OR table_name LIKE '_svc%'
      )
      ORDER BY table_name
    `)

    console.log(
      JSON.stringify(
        {
          ok: true,
          message: 'Services schema applied (non-interactive SQL)',
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
