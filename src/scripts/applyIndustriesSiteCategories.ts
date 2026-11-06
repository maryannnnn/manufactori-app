import 'dotenv/config'
import pg from 'pg'

/**
 * Adds industries ↔ site-categories columns.
 * Does not change parentIndustry or specialization URLs.
 */
const sql = `
ALTER TABLE ind_rels ADD COLUMN IF NOT EXISTS site_categories_id integer;

DO $$ BEGIN
  ALTER TABLE ind_rels ADD CONSTRAINT ind_rels_site_categories_fk
    FOREIGN KEY (site_categories_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS ind_rels_site_categories_id_idx
  ON ind_rels USING btree (site_categories_id);

ALTER TABLE _ind_v_rels ADD COLUMN IF NOT EXISTS site_categories_id integer;

DO $$ BEGIN
  ALTER TABLE _ind_v_rels ADD CONSTRAINT _ind_v_rels_site_categories_fk
    FOREIGN KEY (site_categories_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS _ind_v_rels_site_categories_id_idx
  ON _ind_v_rels USING btree (site_categories_id);
`

const run = async () => {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  await client.query(sql)
  await client.end()
  console.log('ind_rels.site_categories_id applied')
}

void run()
