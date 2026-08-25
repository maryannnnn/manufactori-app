import 'dotenv/config'
import pg from 'pg'

/**
 * Adds posts ↔ site-categories relationship column on posts_rels.
 * Does not touch blog categories (`categories_id`).
 */
const sql = `
ALTER TABLE posts_rels ADD COLUMN IF NOT EXISTS site_categories_id integer;

DO $$ BEGIN
  ALTER TABLE posts_rels ADD CONSTRAINT posts_rels_site_categories_fk
    FOREIGN KEY (site_categories_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS posts_rels_site_categories_id_idx
  ON posts_rels USING btree (site_categories_id);

-- Draft/versioned posts use the same pattern when versions exist.
ALTER TABLE _posts_v_rels ADD COLUMN IF NOT EXISTS site_categories_id integer;

DO $$ BEGIN
  ALTER TABLE _posts_v_rels ADD CONSTRAINT _posts_v_rels_site_categories_fk
    FOREIGN KEY (site_categories_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS _posts_v_rels_site_categories_id_idx
  ON _posts_v_rels USING btree (site_categories_id);

CREATE TABLE IF NOT EXISTS payload_migrations (
  id serial PRIMARY KEY NOT NULL,
  name varchar,
  batch numeric,
  updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
  created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

INSERT INTO payload_migrations (name, batch)
SELECT '20260825_posts_site_categories', 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260825_posts_site_categories'
);
`

const apply = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('posts_rels.site_categories_id applied')
  } finally {
    client.release()
    await pool.end()
  }
}

void apply()
