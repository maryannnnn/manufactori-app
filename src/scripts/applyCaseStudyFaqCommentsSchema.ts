import 'dotenv/config'
import pg from 'pg'

/**
 * Adds the array tables behind the Case Study FAQ questions and the Case Study
 * discussion thread.
 *
 * Both arrays live inside a block, so they follow the same naming and column
 * shape as the existing `csCont_columns` / `_csCont_v_columns` pair:
 *   live     {blockDbName}_{arrayName}     `_parent_id varchar` -> block row id
 *   versions _{blockDbName}_v_{arrayName}  `_parent_id integer` -> version row id
 *
 * Version tables use a serial `id` plus `_uuid`, matching how Payload stores
 * drafts for the other case study blocks.
 */
const sql = `
-- FAQ questions
CREATE TABLE IF NOT EXISTS "csFAQ_items" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar NOT NULL,
  "question" varchar,
  "answer" jsonb,
  CONSTRAINT "csFAQ_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "csFAQ_items_order_idx" ON "csFAQ_items" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "csFAQ_items_parent_id_idx" ON "csFAQ_items" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "csFAQ_items" ADD CONSTRAINT "csFAQ_items_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."csFAQ"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_csFAQ_v_items" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial NOT NULL,
  "question" varchar,
  "answer" jsonb,
  "_uuid" varchar,
  CONSTRAINT "_csFAQ_v_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "_csFAQ_v_items_order_idx" ON "_csFAQ_v_items" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_csFAQ_v_items_parent_id_idx" ON "_csFAQ_v_items" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_csFAQ_v_items" ADD CONSTRAINT "_csFAQ_v_items_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_csFAQ_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Discussion thread
CREATE TABLE IF NOT EXISTS "csCom_comments" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar NOT NULL,
  "author" varchar,
  "role" varchar,
  "date" timestamp(3) with time zone,
  "depth" numeric DEFAULT 0,
  "is_expert" boolean DEFAULT false,
  "body" jsonb,
  CONSTRAINT "csCom_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "csCom_comments_order_idx" ON "csCom_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "csCom_comments_parent_id_idx" ON "csCom_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "csCom_comments" ADD CONSTRAINT "csCom_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."csCom"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_csCom_v_comments" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial NOT NULL,
  "author" varchar,
  "role" varchar,
  "date" timestamp(3) with time zone,
  "depth" numeric DEFAULT 0,
  "is_expert" boolean DEFAULT false,
  "body" jsonb,
  "_uuid" varchar,
  CONSTRAINT "_csCom_v_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "_csCom_v_comments_order_idx" ON "_csCom_v_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_csCom_v_comments_parent_id_idx" ON "_csCom_v_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_csCom_v_comments" ADD CONSTRAINT "_csCom_v_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_csCom_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payload_migrations (name, batch)
SELECT '20260923_cs_faq_comments', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260923_cs_faq_comments'
);
`

const apply = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')

    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public' AND table_name IN (
        'csFAQ_items','_csFAQ_v_items','csCom_comments','_csCom_v_comments'
      )
      ORDER BY table_name
    `)
    console.log(
      JSON.stringify({ ok: true, tables: tables.rows.map((r) => r.table_name) }, null, 2),
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
