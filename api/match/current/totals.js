import { query } from '../../_db.js'
import { fixedWindowLimiter } from '../../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'GET:/match/current/totals' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }

  const { rows: matchRows } = await query(
    `select id, challenger1_id, challenger2_id
     from match
     where now() between start_at and end_at
     order by start_at desc
     limit 1`
  )
  if (matchRows.length === 0) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'no_active_match' }))
  }
  const { id: matchId, challenger1_id, challenger2_id } = matchRows[0]

  const { rows } = await query(
    `select fan_id, total from match_fan_totals where match_id = $1 and fan_id in ($2, $3)`,
    [matchId, challenger1_id, challenger2_id]
  )
  const totals = { [challenger1_id]: 0, [challenger2_id]: 0 }
  for (const r of rows) totals[r.fan_id] = r.total

  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ totals }))
}



