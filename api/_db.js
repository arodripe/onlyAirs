import pg from 'pg'

const { Pool } = pg

const DEFAULT_DB_URL = 'postgres://onlyairs:onlyairs@localhost:5432/onlyairs'

let pool
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL
    // Tight pool defaults to play nice with serverless runtimes and small DBs
    pool = new Pool({
      connectionString,
      max: Number(process.env.PG_POOL_MAX || 3),
      idleTimeoutMillis: 5_000,
      connectionTimeoutMillis: 3_000,
    })
  }
  return pool
}

export async function query(text, params) {
  const client = await getPool().connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}


