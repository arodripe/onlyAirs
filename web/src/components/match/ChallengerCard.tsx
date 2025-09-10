import IconsOverlay from '../common/IconOverlay'
import CountryFlag from '../common/CountryFlag'
import HeartCount from '../common/HeartCount'
import VoteButton from '../common/VoteButton'
import { useEffect, useRef, useState } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'

export default function ChallengerCard({ title, fan, total, onVote, onFocus, onDoubleClick, active = false }: { title: string; fan: any; total: number; onVote?: () => void; onFocus?: () => void; onDoubleClick?: () => void; active?: boolean }) {
  const [revealDesc, setRevealDesc] = useState(false)
  const [typed, setTyped] = useState('')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // reset when card becomes inactive or fan changes
    setRevealDesc(false)
    setTyped('')
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null }
  }, [active, fan?.id])

  const typewritten = useTypewriter(fan?.description || '', 25, revealDesc)
  useEffect(() => { setTyped(typewritten) }, [typewritten])

  const handleClick = () => {
    if (onFocus) onFocus()
    if (active) setRevealDesc(true)
  }
  return (
    <div
      className={`rounded-2xl p-4 flex flex-col bg-white shadow-xl border border-gray-200 transition-all duration-300 ${active ? 'ring-2 ring-brand' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="font-medium">{title}</div>
      </div>
      <div className="relative overflow-hidden rounded-md bg-gray-50 aspect-[4/3] sm:aspect-square">
        <img src={fan.imageUrl} alt={fan.displayName} className="object-cover w-full h-full" />
        <IconsOverlay corner="top-right">
          <span className="text-2xl leading-none"><CountryFlag code={fan.countryCode} /></span>
        </IconsOverlay>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="font-medium truncate max-w-[60%]" title={fan.displayName}>{fan.displayName}</div>
        <div className="text-gray-600 flex items-center gap-2">
          <HeartCount count={total} />
        </div>
      </div>
      {fan.description && (
        <div className={`mt-2 text-xs text-gray-600 ${revealDesc ? 'min-h-[4.5rem]' : 'min-h-[2.5rem]'} transition-all duration-300`}>
          {revealDesc ? typed : null}
        </div>
      )}
      <VoteButton onClick={onVote} />
    </div>
  )
}


