import { useEffect, useRef, useState } from 'react'

export function useTypewriter(text: string, speedMs = 25, enabled = true) {
  const [output, setOutput] = useState('')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) { setOutput(''); return }
    setOutput('')
    let i = 0
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null }
    timerRef.current = window.setInterval(() => {
      i += 1
      setOutput(text.slice(0, i))
      if (i >= text.length && timerRef.current) {
        window.clearInterval(timerRef.current); timerRef.current = null
      }
    }, speedMs)
    return () => { if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null } }
  }, [text, speedMs, enabled])

  return output
}


