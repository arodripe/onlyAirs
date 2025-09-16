import { getPool } from '../../_db.js'
import { fixedWindowLimiter } from '../../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'POST:/fans/:id/like' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }
  const fanId = req.query.id
  let count = 1
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (body && Number.isFinite(body.count) && body.count > 0) count = Math.min(100, Math.floor(body.count))
  } catch {}

  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query('begin')
    const { rows: matchRows } = await client.query(
      `select id, challenger1_id, challenger2_id from match where now() between start_at and end_at order by start_at desc limit 1`
    )
    if (matchRows.length === 0) {
      await client.query('rollback')
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 404
      return res.end(JSON.stringify({ error: 'no_active_match' }))
    }
    const matchId = matchRows[0].id
    const { challenger1_id, challenger2_id } = matchRows[0]
    if (fanId !== challenger1_id && fanId !== challenger2_id) {
      await client.query('rollback')
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'fan_not_in_active_match' }))
    }

    // Insert N vote rows efficiently
    // Using generate_series to avoid many round trips
    await client.query(
      `insert into vote(match_id, fan_id, created_at)
       select $1, $2, now() from generate_series(1, $3)`,
      [matchId, fanId, count]
    )

    await client.query('commit')
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ ok: true }))
  } catch (e) {
    try { await client.query('rollback') } catch {}
    res.statusCode = 500
    return res.end('Internal Server Error')
  } finally {
    client.release()
  }
}


