import 'dotenv/config'
import pg from 'pg'

/**
 * Adds Case Study company_logo and Service service_card_image.
 * push remains false.
 */
const sql = `
ALTER TABLE "cs" ADD COLUMN IF NOT EXISTS "company_logo_id" integer;
ALTER TABLE "_cs_v" ADD COLUMN IF NOT EXISTS "version_company_logo_id" integer;
ALTER TABLE "svc" ADD COLUMN IF NOT EXISTS "service_card_image_id" integer;
ALTER TABLE "_svc_v" ADD COLUMN IF NOT EXISTS "version_service_card_image_id" integer;

DO $$ BEGIN
  ALTER TABLE "cs" ADD CONSTRAINT "cs_company_logo_id_media_id_fk"
    FOREIGN KEY ("company_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "_cs_v" ADD CONSTRAINT "_cs_v_version_company_logo_id_media_id_fk"
    FOREIGN KEY ("version_company_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "svc" ADD CONSTRAINT "svc_service_card_image_id_media_id_fk"
    FOREIGN KEY ("service_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "_svc_v" ADD CONSTRAINT "_svc_v_version_service_card_image_id_media_id_fk"
    FOREIGN KEY ("version_service_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "cs_company_logo_idx" ON "cs" USING btree ("company_logo_id");
CREATE INDEX IF NOT EXISTS "_cs_v_version_version_company_logo_idx" ON "_cs_v" USING btree ("version_company_logo_id");
CREATE INDEX IF NOT EXISTS "svc_service_card_image_idx" ON "svc" USING btree ("service_card_image_id");
CREATE INDEX IF NOT EXISTS "_svc_v_version_version_service_card_image_idx" ON "_svc_v" USING btree ("version_service_card_image_id");
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
    console.log('Company logo and service card image columns applied')
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
