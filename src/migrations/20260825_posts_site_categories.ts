import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts_rels" ADD COLUMN IF NOT EXISTS "site_categories_id" integer;

    DO $$ BEGIN
      ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_site_categories_fk"
        FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "posts_rels_site_categories_id_idx"
      ON "posts_rels" USING btree ("site_categories_id");

    ALTER TABLE "_posts_v_rels" ADD COLUMN IF NOT EXISTS "site_categories_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_site_categories_fk"
        FOREIGN KEY ("site_categories_id") REFERENCES "public"."site_categories"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "_posts_v_rels_site_categories_id_idx"
      ON "_posts_v_rels" USING btree ("site_categories_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_site_categories_fk";
    DROP INDEX IF EXISTS "posts_rels_site_categories_id_idx";
    ALTER TABLE "posts_rels" DROP COLUMN IF EXISTS "site_categories_id";

    ALTER TABLE "_posts_v_rels" DROP CONSTRAINT IF EXISTS "_posts_v_rels_site_categories_fk";
    DROP INDEX IF EXISTS "_posts_v_rels_site_categories_id_idx";
    ALTER TABLE "_posts_v_rels" DROP COLUMN IF EXISTS "site_categories_id";
  `)
}
