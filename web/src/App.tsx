import { useEffect, useMemo, useState } from 'react'
import { createClient } from './lib/api'
import Feed from './components/feed/Feed'
import Header from './components/layout/Header'
import Container from './components/layout/Container'
import Timer from './components/match/Timer'
import ChallengerCard from './components/match/ChallengerCard'

function useCountdown(endAtIso: string | null) {
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

export default function App() {
  const client = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState<any>(null)

  useEffect(() => {
    client.getLiveMatch().then((m) => {
      setMatch(m)
      setLoading(false)
    })
  }, [client])

  const { formatted } = useCountdown(match?.endAt ?? null)

  return (
    <div className="min-h-full flex flex-col">
      <Header title="OnlyAirs" tagline="We love Fans, not Por..." />
      <main className="flex-1">
        <Container>
          <div className="py-10">
          {loading && <div>Loading…</div>}
          {!loading && match && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-medium">Live Match</div>
                <Timer endAt={match.endAt} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ChallengerCard title="Challenger 1" fan={match.challenger1} total={match.totals[match.challenger1.id] ?? 0} />
                <ChallengerCard title="Challenger 2" fan={match.challenger2} total={match.totals[match.challenger2.id] ?? 0} />
              </div>
              <Feed />
            </>
          )}
          </div>
        </Container>
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500">© <span className="font-bold">{new Date().getFullYear()}</span> <span className="font-bold">onlyairs.com</span>  made with ❤️ and 🤣 in <span className="font-bold">Madrid, Spain </span> by <span className="font-bold"> Mochi</span></div>
      </footer>
    </div>
  )
}
 
