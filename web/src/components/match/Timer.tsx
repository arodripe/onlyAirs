import { useCountdown } from '../../hooks/useCountdown'

export default function Timer({ endAt }: { endAt: string }) {
  const { formatted } = useCountdown(endAt)
  return <span className="text-sm text-gray-600">Ends in {formatted}</span>
}


