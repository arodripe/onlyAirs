import { getPool } from '../_db.js'
import { fixedWindowLimiter } from '../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 60, keyPrefix: 'POST:/claps/batch' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed') }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    res.statusCode = 400
    return res.end('Invalid JSON')
  }

  const claps = Array.isArray(body?.claps) ? body.claps : []
  if (claps.length === 0) { res.statusCode = 400; return res.end('No claps provided') }

  // Normalize and validate counts with a simple cap per item and total cap
  const MAX_PER_ITEM = 100
  const MAX_TOTAL = 100
  const normalized = new Map()
  let total = 0
  for (const item of claps) {
    const fanId = item?.fanId
    let count = Number.isFinite(item?.count) ? Math.floor(item.count) : 0
    if (!fanId || count <= 0) continue
    count = Math.min(MAX_PER_ITEM, count)
    const prev = normalized.get(fanId) || 0
    normalized.set(fanId, Math.min(MAX_PER_ITEM, prev + count))
  }
  for (const c of normalized.values()) total += c
  if (total <= 0) { res.statusCode = 400; return res.end('No valid claps') }
  if (total > MAX_TOTAL) {
    // scale down proportionally to respect MAX_TOTAL
    const scale = MAX_TOTAL / total
    for (const [fanId, c] of [...normalized.entries()]) {
      normalized.set(fanId, Math.max(0, Math.floor(c * scale)))
    }
  }

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

    // Validate all fanIds are part of current match
    for (const fanId of normalized.keys()) {
      if (fanId !== challenger1_id && fanId !== challenger2_id) {
        await client.query('rollback')
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 400
        return res.end(JSON.stringify({ error: 'fan_not_in_active_match', fanId }))
      }
    }

    // Insert one row per fan with aggregated count
    for (const [fanId, count] of normalized.entries()) {
      if (count <= 0) continue
      await client.query(
        `insert into clap(match_id, fan_id, count, created_at) values ($1, $2, $3, now())`,
        [matchId, fanId, count]
      )
    }

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


