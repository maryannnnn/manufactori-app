import 'dotenv/config'
import pg from 'pg'

/**
 * Adds plugin-seo meta.title / meta.description to Post Categories and
 * Case Study Categories. push remains false.
 */
const sql = `
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
ALTER TABLE "csc" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
ALTER TABLE "csc" ADD COLUMN IF NOT EXISTS "meta_description" varchar;
`

const apply = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Category SEO columns applied')
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
