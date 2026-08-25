import 'dotenv/config'
import pg from 'pg'

const run = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const { rows } = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND (table_name LIKE 'posts%' OR table_name LIKE '_posts%')
    ORDER BY 1
  `)
  console.log(rows.map((r) => r.table_name).join('\n'))
  await pool.end()
}

void run()
