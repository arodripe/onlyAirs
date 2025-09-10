import { useEffect, useMemo, useRef, useState } from 'react'
import type { FeedEntry } from '../../lib/types'
import { createClient } from '../../lib/api'
import HeartCount from '../common/HeartCount'
import CountryFlag from '../common/CountryFlag'
import IconsOverlay from '../common/IconOverlay'
import { useTypewriter } from '../../hooks/useTypewriter'

function FeedItemCard({ entry }: { entry: FeedEntry }) {
  const { fan, total, result } = entry
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) setVisible(true)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const typed = useTypewriter(fan.description || '', 25, visible)
  return (
    <div ref={ref} className="border rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-square bg-gray-50">
        <img src={fan.imageUrl} alt={fan.displayName} className="object-cover w-full h-full" />
        <IconsOverlay corner="top-right">
          <span className="text-2xl leading-none"><CountryFlag code={fan.countryCode} /></span>
        </IconsOverlay>
        <IconsOverlay corner="bottom-right">
          <span className="text-2xl leading-none select-none">{result === 'winner' ? '🏆' : '💩'}</span>
        </IconsOverlay>
      </div>
      <div className="p-3 text-sm flex items-center justify-between">
        <div className="font-medium truncate" title={fan.displayName}>{fan.displayName}</div>
        <div className="text-gray-600 flex items-center gap-2">
          <HeartCount count={total} />
          <span className="text-brand">{result}</span>
        </div>
      </div>
      {fan.description && (
        <div className="px-3 pb-3 text-xs text-gray-600 min-h-[2.5rem]" title={fan.description}>{typed}</div>
      )}
    </div>
  )
}

export default function Feed() {
  const client = useMemo(() => createClient(), [])
  const [items, setItems] = useState<FeedEntry[]>([])
  const [offset, setOffset] = useState(0)
  const offsetRef = useRef(0)
  const [done, setDone] = useState(false)
  const loadingRef = useRef(false)
  const loadMore = async () => {
    if (loadingRef.current || done) return
    loadingRef.current = true
    const base = offsetRef.current
    const batch = await client.getFeedEntries({ offset: base, limit: 9 })
    setItems((prev) => {
      const existing = new Set(prev.map((e) => e.id))
      const merged = [...prev]
      for (const b of batch) {
        if (!existing.has(b.id)) merged.push(b)
      }
      return merged
    })
    offsetRef.current = base + batch.length
    setOffset(offsetRef.current)
    if (batch.length === 0) setDone(true)
    loadingRef.current = false
  }

  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        loadMore()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  })

  return (
    <div className="mt-12">
      <div className="mb-4 text-lg font-medium brand-gradient-text">Recent Fans</div>
      <div className="max-w-xl mx-auto space-y-6">
        {items.map((entry) => (
          <FeedItemCard key={entry.id} entry={entry} />
        ))}
      </div>
      {!done && (
        <div ref={sentinelRef} className="h-12 flex items-center justify-center text-sm text-gray-500">
          Loading more…
        </div>
      )}
    </div>
  )
}

 


