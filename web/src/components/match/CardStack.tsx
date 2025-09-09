import { useMemo, useState } from 'react'
import ChallengerCard from './ChallengerCard'

type Side = 'left' | 'right'

export default function CardStack({ a, b, totals }: { a: any; b: any; totals: Record<string, number> }) {
  // Randomize initial front card
  const [front, setFront] = useState<'a' | 'b'>(() => (Math.random() < 0.5 ? 'a' : 'b'))
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0) // 0 idle, 1 pre-shift, 2 cross, 3 settle
  const [nextFront, setNextFront] = useState<'a' | 'b' | null>(null)
  const [vertical, setVertical] = useState(false)

  const cards = useMemo(() => ({ a, b }), [a, b])

  const back: 'a' | 'b' = front === 'a' ? 'b' : 'a'
  const frontFan = cards[front]
  const backFan = cards[back]

  const transforms = (side: Side, role: 'front' | 'back' | 'frontPush' | 'backPrep' | 'toFront' | 'toBack' | 'frontExpanded') => {
    const txBase = side === 'left' ? -60 : 60
    const rotBase = side === 'left' ? -12 : 12
    let tx = txBase
    let ty = 0
    let rot = rotBase
    let scale = 0.95

    if (role === 'front') { ty = -4; scale = 0.97 }
    if (role === 'back') { ty = 22; scale = 0.93 }
    if (role === 'frontPush') { tx = txBase + (side === 'right' ? 20 : -20); ty = 4; scale = 0.95 }
    if (role === 'backPrep') { tx = txBase + (side === 'left' ? -20 : 20); ty = 26; scale = 0.92 }
    if (role === 'toFront') { side = 'right'; tx = 10; ty = -2; rot = 12; scale = 0.98 }
    if (role === 'toBack') { side = 'left'; tx = -10; ty = 18; rot = -12; scale = 0.94 }
    if (role === 'frontExpanded') { side = 'right'; tx = 0; ty = 0; rot = 0; scale = 1 }
    return `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`
  }

  return (
    <div className="relative h-[66vh] max-h-[660px] grid place-items-center">
      {/** Always keep front on the right and back on the left for readability on mobile */}
      {(() => { return null })()}
      {/* Back card */}
      <div
        className="absolute w-[min(72vw,440px)]"
        style={{
          transform: transforms('left', nextFront === back ? (stage === 1 ? 'backPrep' : stage === 2 ? 'toFront' : 'front') : 'back'),
          transformOrigin: 'center',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: nextFront === back && stage >= 2 ? 35 : 20,
        }}
      >
        <ChallengerCard
          title={back === 'a' ? 'Challenger 1' : 'Challenger 2'}
          fan={backFan}
          total={totals[backFan.id] ?? 0}
          onFocus={() => {
            if (stage !== 0) return
            if (back !== front) {
              setVertical(false)
              setNextFront(back)
              setStage(1)
              setTimeout(() => setStage(2), 300)
              setTimeout(() => { setFront(back); setStage(3) }, 300 + 200)
              setTimeout(() => { setStage(0); setNextFront(null) }, 300 + 200 + 120)
            }
          }}
          active={false}
        />
      </div>

      {/* Front card */}
      <div
        className="absolute w-[min(72vw,440px)]"
        style={{
          transform: transforms('right', vertical && stage === 0 && !nextFront ? 'frontExpanded' : (nextFront ? (stage === 1 ? 'frontPush' : stage === 2 ? 'toBack' : 'back') : 'front')),
          transformOrigin: 'center',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 30,
        }}
      >
        <ChallengerCard
          title={front === 'a' ? 'Challenger 1' : 'Challenger 2'}
          fan={frontFan}
          total={totals[frontFan.id] ?? 0}
          onFocus={() => { if (stage === 0 && !nextFront) setVertical((v) => !v) }}
          active
        />
      </div>
    </div>
  )
}