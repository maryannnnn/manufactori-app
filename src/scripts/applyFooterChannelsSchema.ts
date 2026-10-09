import 'dotenv/config'
import pg from 'pg'

/**
 * Adds Footer global channel URL columns. Table name is `footer`. push remains false.
 */
const sql = `
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_linkedin" varchar;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_facebook" varchar;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_whatsapp" varchar;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_telegram" varchar;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_email" varchar;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "channels_phone" varchar;
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
    console.log('Footer channel columns applied')
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
