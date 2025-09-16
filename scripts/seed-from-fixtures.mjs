import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const connectionString = process.env.DATABASE_URL || 'postgres://onlyairs:onlyairs@localhost:5432/onlyairs'
const client = new Client({ connectionString })

async function main() {
  const fansJsonPath = path.join(root, 'web', 'src', 'fixtures', 'fans.json')
  const fansText = await fs.readFile(fansJsonPath, 'utf8')
  const fans = JSON.parse(fansText)

  await client.connect()
  try {
    await client.query('begin')
    for (const f of fans) {
      // Let Postgres generate UUID via default gen_random_uuid()
      await client.query(
        `insert into fan (display_name, image_url, country_code, created_at)
         values ($1, $2, $3, $4)`,
        [f.displayName, f.imageUrl, f.countryCode, f.createdAt]
      )
    }

    // Create a current match with two latest fans
    const { rows } = await client.query(`select id from fan order by created_at desc limit 2`)
    if (rows.length === 2) {
      await client.query(
        `insert into match (challenger1_id, challenger2_id, start_at, end_at)
         values ($1, $2, now(), now() + interval '6 hours')`,
        [rows[1].id, rows[0].id]
      )
    }

    await client.query('commit')
    console.log('Seeded fans and current match from fixtures')
  } catch (e) {
    await client.query('rollback')
    throw e
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


