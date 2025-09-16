import { query } from './_db.js'

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.length > 0) return xf.split(',')[0].trim()
  return req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown'
}

export function fixedWindowLimiter({ limitPerMinute, keyPrefix }) {
  return async function rateLimit(req, res) {
    const ip = getClientIp(req)
    const now = new Date()
    const windowStart = new Date(Math.floor(now.getTime() / 60000) * 60000)
    const key = `${keyPrefix}:${ip}`

    await query(
      'insert into rate_limit(key, window_start, count) values ($1, $2, 1) on conflict(key, window_start) do update set count = rate_limit.count + 1',
      [key, windowStart]
    )

    const { rows } = await query(
      'select count from rate_limit where key = $1 and window_start = $2',
      [key, windowStart]
    )
    const count = rows?.[0]?.count ?? 0
    if (count > limitPerMinute) {
      res.statusCode = 429
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'rate_limited' }))
      return false
    }
    return true
  }
}


