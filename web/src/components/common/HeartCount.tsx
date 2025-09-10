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
    size === 'xl' ? 'h-10 w-10' :
    size === 'lg' ? 'h-8 w-8' :
    size === 'md' ? 'h-6 w-6' :
    'h-4 w-4'
  )

  return (
    <span className="inline-flex items-center gap-1 text-brand">
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${sizeClass} ${pulsing ? 'heart-pulse' : ''}`}>
        <defs>
          <linearGradient id="brand-heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="20%" stopColor="rgb(152, 84, 26)" />
            <stop offset="50%" stopColor="rgb(255, 107, 53)" />
            <stop offset="100%" stopColor="rgb(255, 165, 0)" />
          </linearGradient>
        </defs>
        <path fill="url(#brand-heart-gradient)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.01 4.01 4 6.5 4c1.76 0 3.41.99 4.22 2.49.2.36.68.36.89 0C12.42 4.99 14.07 4 15.83 4 18.32 4 20.33 6.01 20.33 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"/>
      </svg>
      <span className={`font-medium brand-gradient-text ${pulsing ? 'count-pulse' : ''}`}>{count}</span>
    </span>
  )
}


