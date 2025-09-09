import { useCountdown } from '../../hooks/useCountdown'

export default function Timer({ endAt }: { endAt: string }) {
  const { formatted } = useCountdown(endAt)
  return <span className="text-sm text-gray-600">Ends in <span className="font-bold reversed-brand-gradient-text">{formatted}</span></span>
}


