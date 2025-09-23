import { useEffect, useRef, useState } from 'react'

type HeartSize = 'sm' | 'md' | 'lg' | 'xl'

export default function HeartCount({ count, animateOnChange = true, size = 'sm' }: { count: number; animateOnChange?: boolean; size?: HeartSize }) {
  const [pulsing, setPulsing] = useState(false)
  const prevCountRef = useRef<number>(count)

  useEffect(() => {
    if (!animateOnChange) { prevCountRef.current = count; return }
    const prev = prevCountRef.current
    const increased = typeof prev === 'number' && count > prev
    prevCountRef.current = count
    if (!increased) return

    setPulsing(false)
    const startId = window.setTimeout(() => setPulsing(true), 0)
    const stopId = window.setTimeout(() => setPulsing(false), 320)
    return () => { window.clearTimeout(startId); window.clearTimeout(stopId) }
  }, [count, animateOnChange])

  const sizeClass = (
    size === 'xl' ? '2em' :
    size === 'lg' ? '1.5em' :
    size === 'md' ? '1em' :
    '0.5em'
  )

  return (
    <span className="inline-flex items-center gap-1 text-brand">
      <span className={`inline-flex items-center justify-center ${pulsing ? 'heart-pulse' : ''}`} aria-hidden="true">
        <span className="brand-gradient-text" style={{ fontSize: sizeClass, lineHeight: 1 }}>👏</span>
      </span>
      <span className={`font-medium brand-gradient-text ${pulsing ? 'count-pulse' : ''}`}>{count}</span>
    </span>
  )
}
