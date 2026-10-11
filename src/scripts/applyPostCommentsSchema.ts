import 'dotenv/config'
import pg from 'pg'

/**
 * Adds the discussion array behind Post Comments, matching Case Study comments.
 * Parent tables already exist: posts_blocks_post_comments_block / _posts_v_...
 */
const sql = `
CREATE TABLE IF NOT EXISTS "posts_blocks_post_comments_block_comments" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar NOT NULL,
  "author" varchar,
  "role" varchar,
  "date" timestamp(3) with time zone,
  "depth" numeric DEFAULT 0,
  "is_expert" boolean DEFAULT false,
  "body" jsonb,
  CONSTRAINT "posts_blocks_post_comments_block_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "posts_blocks_post_comments_block_comments_order_idx"
  ON "posts_blocks_post_comments_block_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "posts_blocks_post_comments_block_comments_parent_id_idx"
  ON "posts_blocks_post_comments_block_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "posts_blocks_post_comments_block_comments"
    ADD CONSTRAINT "posts_blocks_post_comments_block_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_post_comments_block"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "_posts_v_blocks_post_comments_block_comments" (
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
  CONSTRAINT "_posts_v_blocks_post_comments_block_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "_posts_v_blocks_post_comments_block_comments_order_idx"
  ON "_posts_v_blocks_post_comments_block_comments" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "_posts_v_blocks_post_comments_block_comments_parent_id_idx"
  ON "_posts_v_blocks_post_comments_block_comments" USING btree ("_parent_id");
DO $$ BEGIN
  ALTER TABLE "_posts_v_blocks_post_comments_block_comments"
    ADD CONSTRAINT "_posts_v_blocks_post_comments_block_comments_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_post_comments_block"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO payload_migrations (name, batch)
SELECT '20261010_post_comments', COALESCE((SELECT MAX(batch) FROM payload_migrations), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20261010_post_comments'
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
        'posts_blocks_post_comments_block_comments',
        '_posts_v_blocks_post_comments_block_comments'
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
