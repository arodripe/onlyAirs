import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.resolve(__dirname, '..')
const schemaPath = path.join(root, 'db', 'schema.sql')

const connectionString = process.env.DATABASE_URL || 'postgres://onlyairs:onlyairs@localhost:5432/onlyairs'

const sql = await fs.readFile(schemaPath, 'utf8')
const client = new Client({ connectionString })
await client.connect()
try {
  await client.query(sql)
  console.log('Schema applied successfully')
} finally {
  await client.end()
}


