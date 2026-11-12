import 'dotenv/config'
import pg from 'pg'

/**
 * Adds public author profile fields used on article author blocks.
 * Users: jobTitle + professionalFocus
 * posts_populated_authors (+ versions): same fields for the denormalized afterRead array
 */

const sql = `
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "job_title" varchar;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "professional_focus" varchar;

ALTER TABLE "posts_populated_authors" ADD COLUMN IF NOT EXISTS "job_title" varchar;
ALTER TABLE "posts_populated_authors" ADD COLUMN IF NOT EXISTS "professional_focus" varchar;

ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "job_title" varchar;
ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "professional_focus" varchar;
`

const main = async () => {
  const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URI / DATABASE_URL is required')

  const client = new pg.Client({ connectionString })
  await client.connect()
  try {
    await client.query(sql)
    const users = await client.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'users' AND column_name IN ('job_title', 'professional_focus')
       ORDER BY column_name`,
    )
    const populated = await client.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'posts_populated_authors' AND column_name IN ('job_title', 'professional_focus')
       ORDER BY column_name`,
    )
    console.log(
      JSON.stringify(
        {
          ok: true,
          usersColumns: users.rows.map((row) => row.column_name),
          populatedAuthorsColumns: populated.rows.map((row) => row.column_name),
        },
        null,
        2,
      ),
    )
  } finally {
    await client.end()
  }
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
