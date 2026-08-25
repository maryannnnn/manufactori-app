import 'dotenv/config'
import pg from 'pg'

const sql = `
CREATE TABLE IF NOT EXISTS site_categories (
  id serial PRIMARY KEY NOT NULL,
  title varchar NOT NULL,
  generate_slug boolean DEFAULT true,
  slug varchar NOT NULL,
  parent_id integer,
  updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
  created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS site_categories_breadcrumbs (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  doc_id integer,
  url varchar,
  label varchar
);

DO $$ BEGIN
  ALTER TABLE site_categories ADD CONSTRAINT site_categories_parent_id_site_categories_id_fk
    FOREIGN KEY (parent_id) REFERENCES public.site_categories(id) ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_categories_breadcrumbs ADD CONSTRAINT site_categories_breadcrumbs_doc_id_site_categories_id_fk
    FOREIGN KEY (doc_id) REFERENCES public.site_categories(id) ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE site_categories_breadcrumbs ADD CONSTRAINT site_categories_breadcrumbs_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS site_categories_slug_idx ON site_categories USING btree (slug);
CREATE INDEX IF NOT EXISTS site_categories_parent_idx ON site_categories USING btree (parent_id);
CREATE INDEX IF NOT EXISTS site_categories_updated_at_idx ON site_categories USING btree (updated_at);
CREATE INDEX IF NOT EXISTS site_categories_created_at_idx ON site_categories USING btree (created_at);
CREATE INDEX IF NOT EXISTS site_categories_breadcrumbs_order_idx ON site_categories_breadcrumbs USING btree (_order);
CREATE INDEX IF NOT EXISTS site_categories_breadcrumbs_parent_id_idx ON site_categories_breadcrumbs USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS site_categories_breadcrumbs_doc_idx ON site_categories_breadcrumbs USING btree (doc_id);

ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS site_categories_id integer;

DO $$ BEGIN
  ALTER TABLE payload_locked_documents_rels ADD CONSTRAINT payload_locked_documents_rels_site_categories_fk
    FOREIGN KEY (site_categories_id) REFERENCES public.site_categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_site_categories_id_idx
  ON payload_locked_documents_rels USING btree (site_categories_id);

CREATE TABLE IF NOT EXISTS payload_migrations (
  id serial PRIMARY KEY NOT NULL,
  name varchar,
  batch numeric,
  updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
  created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

INSERT INTO payload_migrations (name, batch)
SELECT '20260824_121853_site_categories', 1
WHERE NOT EXISTS (
  SELECT 1 FROM payload_migrations WHERE name = '20260824_121853_site_categories'
);
`

const apply = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('site_categories schema applied')
  } finally {
    client.release()
    await pool.end()
  }
}

void apply()
