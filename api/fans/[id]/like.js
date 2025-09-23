import { getPool } from '../../_db.js'
import { fixedWindowLimiter } from '../../_rateLimit.js'

const rateLimit = fixedWindowLimiter({ limitPerMinute: 30, keyPrefix: 'POST:/fans/:id/like' })

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end()
  const ok = await rateLimit(req, res)
  if (!ok) return

  // Endpoint deprecated/removed in favor of /api/claps/batch
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed') }
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 410
  return res.end(JSON.stringify({ error: 'gone', use: '/api/claps/batch' }))
}


