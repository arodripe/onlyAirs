import { query } from '../../_db.js'
import { fixedWindowLimiter } from '../../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'GET:/fans/:id/likes' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }
  const fanId = req.query.id

  const { rows: matchRows } = await query(
    `select id from match where now() between start_at and end_at order by start_at desc limit 1`
  )
  if (matchRows.length === 0) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'no_active_match' }))
  }
  const matchId = matchRows[0].id

  const { rows } = await query(
    `select total from match_fan_totals where match_id = $1 and fan_id = $2`,
    [matchId, fanId]
  )
  const total = rows.length ? rows[0].total : 0
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ total }))
}


