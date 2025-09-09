import { useEffect, useMemo, useState } from 'react'

export function useCountdown(endAtIso: string | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])
  return useMemo(() => {
    if (!endAtIso) return { ms: 0, formatted: '00:00:00' }
    const end = new Date(endAtIso).getTime()
    const ms = Math.max(0, end - now)
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    return { ms, formatted: `${pad(h)}:${pad(m)}:${pad(s)}` }
  }, [endAtIso, now])
}


