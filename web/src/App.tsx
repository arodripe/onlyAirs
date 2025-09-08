import { useEffect, useMemo, useState } from 'react'
import { createClient } from './lib/api'

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
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">OnlyAirs</div>
          <nav className="text-sm text-gray-600">We love Fans, not Porn</nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          {loading && <div>Loading…</div>}
          {!loading && match && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-medium">Live Match</div>
                <div className="text-sm text-gray-600">Ends in {formatted}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ChallengerCard title="Challenger 1" fan={match.challenger1} total={match.totals[match.challenger1.id] ?? 0} />
                <ChallengerCard title="Challenger 2" fan={match.challenger2} total={match.totals[match.challenger2.id] ?? 0} />
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500">© {new Date().getFullYear()} onlyairs.com</div>
      </footer>
    </div>
  )
}

function ChallengerCard({ title, fan, total }: { title: string; fan: any; total: number }) {
  return (
    <div className="aspect-square border rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="font-medium">{title}</div>
        <div className="">{fan.countryCode}</div>
      </div>
      <div className="flex-1 grid place-content-center overflow-hidden rounded-md bg-gray-50">
        <img src={fan.imageUrl} alt={fan.displayName} className="object-cover w-full h-full" />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="font-medium">{fan.displayName}</div>
        <div className="text-gray-600">Total votes: {total}</div>
      </div>
    </div>
  )
}
