import { useEffect, useState } from 'react'

export function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' ? true : document.visibilityState !== 'hidden')

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}



