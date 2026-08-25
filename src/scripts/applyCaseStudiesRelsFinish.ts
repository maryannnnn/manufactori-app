import 'dotenv/config'
import pg from 'pg'

/**
 * Finishes case-studies wiring on existing shared rel tables
 * (CREATE TABLE IF NOT EXISTS is a no-op when tables already exist without cs_id).
 */
const sql = `
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
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "redirects_rels"
    ADD CONSTRAINT "redirects_rels_case_studies_fk"
    FOREIGN KEY ("cs_id") REFERENCES "public"."cs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payload_migrations (name, batch)
SELECT '20260825_case_studies', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260825_case_studies'
);
`

const apply = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('case-studies rel columns + FKs applied')
  } finally {
    client.release()
    await pool.end()
  }
}

void apply().catch((error) => {
  console.error(error)
  process.exit(1)
})
