import fs from 'fs'

const migrationPath = 'src/migrations/20260825_142701_case_studies.ts'
const text = fs.readFileSync(migrationPath, 'utf8')
const match = text.match(/await db\.execute\(sql`([\s\S]*?)`\)/)
if (!match) {
  console.error('No SQL block found')
  process.exit(1)
}

const sql = match[1]
const statements = sql
  .split(/(?=CREATE TYPE|CREATE TABLE|ALTER TABLE|CREATE UNIQUE INDEX|CREATE INDEX|DO \$\$)/g)
  .map((s) => s.trim())
  .filter(Boolean)

const relevant = statements.filter((statement) =>
  /("cs\b|_cs_|enum_cs|enum__cs|csCont|csPrev|csCT|csVid|csGal|csCom|csFAQ|"cs"|csc_id|cs_id)/.test(
    statement,
  ),
)

const out = relevant
  .map((statement) => {
    // Make idempotent where possible
    return statement
      .replace(/^CREATE TYPE /gm, 'CREATE TYPE IF NOT EXISTS ')
      .replace(/^CREATE TABLE /gm, 'CREATE TABLE IF NOT EXISTS ')
      .replace(/^CREATE UNIQUE INDEX /gm, 'CREATE UNIQUE INDEX IF NOT EXISTS ')
      .replace(/^CREATE INDEX /gm, 'CREATE INDEX IF NOT EXISTS ')
  })
  .join('\n\n')

fs.writeFileSync('src/scripts/_cs_extract.sql', out)
console.log(`Extracted ${relevant.length} statements, ${out.length} chars`)
