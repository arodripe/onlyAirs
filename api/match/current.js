import { query } from '../_db.js'
import { fixedWindowLimiter } from '../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'GET:/match/current' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }

  const { rows } = await query(
    `select id, challenger1_id, challenger2_id, start_at, end_at
     from match
     where now() between start_at and end_at
     order by start_at desc
     limit 1`
  )
  if (rows.length === 0) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'no_active_match' }))
  }
  const m = rows[0]
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      id: m.id,
      challenger1Id: m.challenger1_id,
      challenger2Id: m.challenger2_id,
      startAt: m.start_at,
      endAt: m.end_at,
    })
  )
}


