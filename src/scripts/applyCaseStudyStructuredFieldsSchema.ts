import 'dotenv/config'
import pg from 'pg'

/**
 * Non-interactive schema apply for Case Study structured fields.
 * Matches Payload postgres naming for collection dbName `cs`.
 */
const sql = `
-- Enums
DO $$ BEGIN
  CREATE TYPE "enum_cs_duration" AS ENUM(
    '6_months','1_years','2_years','3_years','4_years','5_years','6_years','7_years','8_years','9_years','10_years',
    '11_years','12_years','13_years','14_years','15_years','16_years','17_years','18_years','19_years','20_years'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__cs_v_version_duration" AS ENUM(
    '6_months','1_years','2_years','3_years','4_years','5_years','6_years','7_years','8_years','9_years','10_years',
    '11_years','12_years','13_years','14_years','15_years','16_years','17_years','18_years','19_years','20_years'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_paidAds_channel" AS ENUM(
    'google_ads','microsoft_ads','yandex_direct','meta_ads','linkedin_ads','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__cs_v_version_paidAds_channel" AS ENUM(
    'google_ads','microsoft_ads','yandex_direct','meta_ads','linkedin_ads','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum_socMed_channel" AS ENUM(
    'linkedin','facebook','instagram','youtube','tiktok','telegram','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "enum__cs_v_version_socMed_channel" AS ENUM(
    'linkedin','facebook','instagram','youtube','tiktok','telegram','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Main cs table columns (groups flatten with snake_case)
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "display_order" numeric;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "duration" "enum_cs_duration";

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "manufacturing_profile_production_capabilities" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "manufacturing_profile_products" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "manufacturing_profile_materials" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "manufacturing_profile_applications" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "business_challenge_initial_state" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "business_challenge_challenge" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "business_challenge_goals" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "digital_ecosystem" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "website_architecture" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "semantic_architecture" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "marketing_strategy_seo_and_content_strategy" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "marketing_strategy_lead_gen_mechanism" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "ai_search_optimization_brand_authority_and_trust" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "ai_search_optimization_entity_and_geo_structure" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "implementation_process" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "results_summary" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "expert_insight" jsonb;

ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "client_testimonial_quote" jsonb;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "client_testimonial_author" varchar;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "client_testimonial_position" varchar;
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "client_testimonial_company" varchar;

-- Versions table
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_featured" boolean DEFAULT false;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_display_order" numeric;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_duration" "enum__cs_v_version_duration";

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_manufacturing_profile_production_capabilities" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_manufacturing_profile_products" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_manufacturing_profile_materials" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_manufacturing_profile_applications" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_business_challenge_initial_state" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_business_challenge_challenge" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_business_challenge_goals" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_digital_ecosystem" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_website_architecture" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_semantic_architecture" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_marketing_strategy_seo_and_content_strategy" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_marketing_strategy_lead_gen_mechanism" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_ai_search_optimization_brand_authority_and_trust" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_ai_search_optimization_entity_and_geo_structure" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_implementation_process" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_results_summary" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_expert_insight" jsonb;

ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_client_testimonial_quote" jsonb;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_client_testimonial_author" varchar;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_client_testimonial_position" varchar;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_client_testimonial_company" varchar;

-- Array tables use Payload dbName convention: {dbName} / _{dbName}_v
-- Applied/fixed by fixCaseStudyArrayTables.ts if names differ.
-- Prefer running: npx tsx --tsconfig tsconfig.json src/scripts/fixCaseStudyArrayTables.ts

INSERT INTO payload_migrations (name, batch)
SELECT '20260916_cs_structured_fields', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260916_cs_structured_fields'
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
    console.log(
      JSON.stringify(
        {
          ok: true,
          message: 'Case Study structured fields schema applied (non-interactive SQL)',
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
