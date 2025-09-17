import { query } from '../_db.js'
import { fixedWindowLimiter } from '../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'GET:/match/bootstrap' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return
  if (req.method !== 'GET') { res.statusCode = 405; return res.end('Method Not Allowed') }

  const { rows: mrows } = await query(
    `select id, challenger1_id, challenger2_id, start_at, end_at
     from match
     where now() between start_at and end_at
     order by start_at desc
     limit 1`
  )
  if (mrows.length === 0) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'no_active_match' }))
  }
  const m = mrows[0]
  const { rows: fans } = await query(
    `select id, display_name, description, image_url, country_code, created_at
     from fan where id in ($1, $2)`,
    [m.challenger1_id, m.challenger2_id]
  )
  const fanMap = new Map(fans.map(f => [f.id, f]))
  const { rows: totals } = await query(
    `select fan_id, total from match_fan_totals where match_id = $1 and fan_id in ($2, $3)`,
    [m.id, m.challenger1_id, m.challenger2_id]
  )
  const totalsObj = { [m.challenger1_id]: 0, [m.challenger2_id]: 0 }
  for (const t of totals) totalsObj[t.fan_id] = t.total

  res.setHeader('Content-Type', 'application/json')
  return res.end(
    JSON.stringify({
      match: { id: m.id, challenger1Id: m.challenger1_id, challenger2Id: m.challenger2_id, startAt: m.start_at, endAt: m.end_at },
      challenger1: fanMap.get(m.challenger1_id) && {
        id: m.challenger1_id,
        displayName: fanMap.get(m.challenger1_id).display_name,
        imageUrl: fanMap.get(m.challenger1_id).image_url,
        countryCode: fanMap.get(m.challenger1_id).country_code,
        description: fanMap.get(m.challenger1_id).description,
        createdAt: fanMap.get(m.challenger1_id).created_at,
      },
      challenger2: fanMap.get(m.challenger2_id) && {
        id: m.challenger2_id,
        displayName: fanMap.get(m.challenger2_id).display_name,
        imageUrl: fanMap.get(m.challenger2_id).image_url,
        countryCode: fanMap.get(m.challenger2_id).country_code,
        description: fanMap.get(m.challenger2_id).description,
        createdAt: fanMap.get(m.challenger2_id).created_at,
      },
      totals: totalsObj,
    })
  )
}


