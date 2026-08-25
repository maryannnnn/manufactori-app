import 'dotenv/config'
import pg from 'pg'

/**
 * Creates layout block tables for Case Study Categories (dbName: csc)
 * by cloning the shape of categories_* block tables.
 */
const sql = `
-- Enums (short names under csc_*)
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_archive_populate_by" AS ENUM('collection', 'selection');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_archive_relation_to" AS ENUM('posts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "enum_csc_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS csc_blocks_cta (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  rich_text jsonb,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_blocks_cta_links (
  _order integer NOT NULL,
  _parent_id varchar NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  link_type enum_csc_blocks_cta_links_link_type DEFAULT 'reference',
  link_new_tab boolean,
  link_url varchar,
  link_label varchar,
  link_appearance enum_csc_blocks_cta_links_link_appearance DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS csc_blocks_content (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_blocks_content_columns (
  _order integer NOT NULL,
  _parent_id varchar NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  size enum_csc_blocks_content_columns_size DEFAULT 'oneThird',
  rich_text jsonb,
  enable_link boolean,
  link_type enum_csc_blocks_content_columns_link_type DEFAULT 'reference',
  link_new_tab boolean,
  link_url varchar,
  link_label varchar,
  link_appearance enum_csc_blocks_content_columns_link_appearance DEFAULT 'default'
);

CREATE TABLE IF NOT EXISTS csc_blocks_media_block (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  media_id integer,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_blocks_archive (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  intro_content jsonb,
  populate_by enum_csc_blocks_archive_populate_by DEFAULT 'collection',
  relation_to enum_csc_blocks_archive_relation_to DEFAULT 'posts',
  "limit" numeric DEFAULT 10,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_blocks_form_block (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  form_id integer,
  enable_intro boolean,
  intro_content jsonb,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_blocks_code (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id varchar PRIMARY KEY NOT NULL,
  language enum_csc_blocks_code_language DEFAULT 'typescript',
  code varchar,
  block_name varchar
);

CREATE TABLE IF NOT EXISTS csc_rels (
  id serial PRIMARY KEY NOT NULL,
  "order" integer,
  parent_id integer NOT NULL,
  path varchar NOT NULL,
  pages_id integer,
  posts_id integer,
  categories_id integer
);

-- FKs
DO $$ BEGIN
  ALTER TABLE csc_blocks_cta ADD CONSTRAINT csc_blocks_cta_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_cta_links ADD CONSTRAINT csc_blocks_cta_links_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc_blocks_cta(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_content ADD CONSTRAINT csc_blocks_content_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_content_columns ADD CONSTRAINT csc_blocks_content_columns_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc_blocks_content(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_media_block ADD CONSTRAINT csc_blocks_media_block_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_media_block ADD CONSTRAINT csc_blocks_media_block_media_id_media_id_fk
    FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_archive ADD CONSTRAINT csc_blocks_archive_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_form_block ADD CONSTRAINT csc_blocks_form_block_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_form_block ADD CONSTRAINT csc_blocks_form_block_form_id_forms_id_fk
    FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_blocks_code ADD CONSTRAINT csc_blocks_code_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_rels ADD CONSTRAINT csc_rels_parent_fk
    FOREIGN KEY (parent_id) REFERENCES public.csc(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_rels ADD CONSTRAINT csc_rels_pages_fk
    FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_rels ADD CONSTRAINT csc_rels_posts_fk
    FOREIGN KEY (posts_id) REFERENCES public.posts(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE csc_rels ADD CONSTRAINT csc_rels_categories_fk
    FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes (best-effort)
CREATE INDEX IF NOT EXISTS csc_blocks_cta_order_idx ON csc_blocks_cta USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_cta_parent_id_idx ON csc_blocks_cta USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_cta_path_idx ON csc_blocks_cta USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_blocks_cta_links_order_idx ON csc_blocks_cta_links USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_cta_links_parent_id_idx ON csc_blocks_cta_links USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_content_order_idx ON csc_blocks_content USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_content_parent_id_idx ON csc_blocks_content USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_content_path_idx ON csc_blocks_content USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_blocks_content_columns_order_idx ON csc_blocks_content_columns USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_content_columns_parent_id_idx ON csc_blocks_content_columns USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_media_block_order_idx ON csc_blocks_media_block USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_media_block_parent_id_idx ON csc_blocks_media_block USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_media_block_path_idx ON csc_blocks_media_block USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_blocks_media_block_media_idx ON csc_blocks_media_block USING btree (media_id);
CREATE INDEX IF NOT EXISTS csc_blocks_archive_order_idx ON csc_blocks_archive USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_archive_parent_id_idx ON csc_blocks_archive USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_archive_path_idx ON csc_blocks_archive USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_blocks_form_block_order_idx ON csc_blocks_form_block USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_form_block_parent_id_idx ON csc_blocks_form_block USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_form_block_path_idx ON csc_blocks_form_block USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_blocks_form_block_form_idx ON csc_blocks_form_block USING btree (form_id);
CREATE INDEX IF NOT EXISTS csc_blocks_code_order_idx ON csc_blocks_code USING btree (_order);
CREATE INDEX IF NOT EXISTS csc_blocks_code_parent_id_idx ON csc_blocks_code USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS csc_blocks_code_path_idx ON csc_blocks_code USING btree (_path);
CREATE INDEX IF NOT EXISTS csc_rels_order_idx ON csc_rels USING btree ("order");
CREATE INDEX IF NOT EXISTS csc_rels_parent_idx ON csc_rels USING btree (parent_id);
CREATE INDEX IF NOT EXISTS csc_rels_path_idx ON csc_rels USING btree (path);
CREATE INDEX IF NOT EXISTS csc_rels_pages_id_idx ON csc_rels USING btree (pages_id);
CREATE INDEX IF NOT EXISTS csc_rels_posts_id_idx ON csc_rels USING btree (posts_id);
CREATE INDEX IF NOT EXISTS csc_rels_categories_id_idx ON csc_rels USING btree (categories_id);
`

const apply = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('csc layout block tables applied')
  } finally {
    client.release()
    await pool.end()
  }
}

void apply()
