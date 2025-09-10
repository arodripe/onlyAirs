import { useEffect, useState } from 'react'
import ChallengerCard from './ChallengerCard'

type Side = 'left' | 'right'

export default function CardStack({ a, b, totals }: { a: any; b: any; totals: Record<string, number> }) {
  // Keep cards stable; just animate wrappers
  const [frontIsA, setFrontIsA] = useState<boolean>(() => Math.random() < 0.5)
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0) // 0 idle, 1 pre-shift, 2 cross, 3 settle
  const [swapTarget, setSwapTarget] = useState<'a' | 'b' | null>(null)
  const [verticalFront, setVerticalFront] = useState(false)
  const [localTotals, setLocalTotals] = useState<Record<string, number>>(() => ({ ...totals }))

  // Keep local totals in sync if props change (e.g., from backend refresh)
  useEffect(() => { setLocalTotals({ ...totals }) }, [totals])

  const handleVote = (fanId: string) => {
    setLocalTotals((prev) => ({
      ...prev,
      [fanId]: (prev[fanId] ?? 0) + 1,
    }))
  }

  const handleVoteClick = (target: 'a' | 'b') => {
    const isFront = (target === 'a') === frontIsA
    if (!isFront) {
      startSwap(target)
      return
    }
    if (!verticalFront) {      
      setVerticalFront(true)
      return
    }
    const fanId = target === 'a' ? a.id : b.id
    handleVote(fanId)
  }

  const transforms = (
    side: Side,
    role: 'front' | 'back' | 'frontPush' | 'backPrep' | 'toFront' | 'toBack' | 'frontExpanded',
  ) => {
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

    return `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale}) translateZ(0)`
  }

  const startSwap = (target: 'a' | 'b') => {
    if (stage !== 0) return
    const targetIsFront = (target === 'a') === frontIsA
    if (targetIsFront) { setVerticalFront((v) => !v); return }
    setVerticalFront(false)
    setSwapTarget(target)
    setStage(1)
    setTimeout(() => setStage(2), 300)
    setTimeout(() => { setFrontIsA(target === 'a'); setStage(3) }, 500)
    setTimeout(() => { setStage(0); setSwapTarget(null) }, 620)
  }

  // Card A wrapper (always renders fan a)
  const sideA: Side = frontIsA ? 'right' : 'left'
  const roleA: any = verticalFront && stage === 0 && !swapTarget && frontIsA
    ? 'frontExpanded'
    : swapTarget === 'a'
      ? (stage === 1 ? (frontIsA ? 'frontPush' : 'backPrep') : stage === 2 ? (frontIsA ? 'toBack' : 'toFront') : (frontIsA ? 'back' : 'front'))
      : (frontIsA ? 'front' : 'back')

  // Card B wrapper (always renders fan b)
  const sideB: Side = frontIsA ? 'left' : 'right'
  const roleB: any = verticalFront && stage === 0 && !swapTarget && !frontIsA
    ? 'frontExpanded'
    : swapTarget === 'b'
      ? (stage === 1 ? (frontIsA ? 'backPrep' : 'frontPush') : stage === 2 ? (frontIsA ? 'toFront' : 'toBack') : (frontIsA ? 'front' : 'back'))
      : (frontIsA ? 'back' : 'front')

  const zA = (frontIsA ? 30 : 20) + (swapTarget === 'a' && stage >= 2 ? 10 : 0)
  const zB = (!frontIsA ? 30 : 20) + (swapTarget === 'b' && stage >= 2 ? 10 : 0)

  return (
    <div className="relative h-[100vh] max-h-[660px] grid place-items-center">
      <div
        className="absolute w-[min(72vw,440px)]"
        style={{
          transform: transforms(sideA, roleA),
          transformOrigin: 'center',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: zA as number,
          willChange: 'transform',
        }}
      >
        <ChallengerCard
          title={'Challenger 1'}
          fan={a}
          total={localTotals[a.id] ?? 0}
          onFocus={() => startSwap('a')}
          onVote={() => handleVoteClick('a')}
          active={frontIsA}
        />
      </div>

      <div
        className="absolute w-[min(72vw,440px)]"
        style={{
          transform: transforms(sideB, roleB),
          transformOrigin: 'center',
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: zB as number,
          willChange: 'transform',
        }}
      >
        <ChallengerCard
          title={'Challenger 2'}
          fan={b}
          total={localTotals[b.id] ?? 0}
          onFocus={() => startSwap('b')}
          onVote={() => handleVoteClick('b')}
          active={!frontIsA}
        />
      </div>
    </div>
  )
}