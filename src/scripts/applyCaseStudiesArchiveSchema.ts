import 'dotenv/config'
import pg from 'pg'

/**
 * Applies the table for the `case-studies-archive` global.
 *
 * Globals are stored in a single-row table named after the slug, matching the
 * existing `header` / `footer` tables. Column names follow the SEO plugin
 * (meta_title / meta_image_id / meta_description), as in `pages` and `cs`.
 */
const sql = `
CREATE TABLE IF NOT EXISTS case_studies_archive (
  id serial PRIMARY KEY NOT NULL,
  title varchar,
  long_title varchar,
  meta_title varchar,
  meta_image_id integer,
  meta_description varchar,
  updated_at timestamp(3) with time zone,
  created_at timestamp(3) with time zone
);

DO $$ BEGIN
  ALTER TABLE case_studies_archive ADD CONSTRAINT case_studies_archive_meta_image_id_media_id_fk
    FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS case_studies_archive_meta_meta_image_idx
  ON case_studies_archive USING btree (meta_image_id);
`

const apply = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('case_studies_archive (case-studies-archive global) schema applied')
  } finally {
    client.release()
    await pool.end()
  }
}

void apply()
