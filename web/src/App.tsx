import { useEffect, useMemo, useState } from 'react'
import { createClient } from './lib/api'
import Feed from './components/feed/Feed'
import Header from './components/layout/Header'
import Container from './components/layout/Container'
import Timer from './components/match/Timer'
import CardStack from './components/match/CardStack'
import { usePageVisibility } from './hooks/usePageVisibility'

// countdown logic lives in hooks/useCountdown.ts via Timer component

export default function App() {
  const client = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [match, setMatch] = useState<any>(null)
  const [totals, setTotals] = useState<Record<string, number>>({})
  const visible = usePageVisibility()

  useEffect(() => {
    client.getLiveMatch().then((m) => {
      setMatch(m)
      setTotals(m?.totals ?? {})
      setLoading(false)
    })
  }, [client])

  useEffect(() => {
    if (!match) return
    let timer: any
    const tick = async () => {
      if (!visible) return
      try {
        const t = await client.getCurrentTotals()
        setTotals(t)
      } catch {}
    }
    // immediate refresh and schedule
    tick()
    timer = setInterval(tick, 15000)
    return () => clearInterval(timer)
  }, [client, match, visible])

  return (
    <div className="min-h-full flex flex-col">
      <Header title="OnlyFans" tagline="We love Fans, not Por..." />
      <main className="flex-1">
        <Container>
          <div className="py-10">
          {loading && <div>Loading…</div>}
          {!loading && match && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-medium"><span className="brand-gradient-text">Live Match</span></div>
                <Timer endAt={match.endAt} />
              </div>
              <CardStack
                a={match.challenger1}
                b={match.challenger2}
                totals={totals}
                onVote={async (fanId) => {
                  try { await client.vote(match.id, fanId) } catch {}
                }}
              />
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
 
