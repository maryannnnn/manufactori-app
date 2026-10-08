import 'dotenv/config'
import pg from 'pg'

/**
 * Adds Featured on Home (`featured`) to Testimonials.
 * Collection dbName is `tstm`. push remains false.
 */
const sql = `
ALTER TABLE "tstm" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;
ALTER TABLE "_tstm_v" ADD COLUMN IF NOT EXISTS "version_featured" boolean DEFAULT false;
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
    console.log('Testimonials featured column applied')
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
