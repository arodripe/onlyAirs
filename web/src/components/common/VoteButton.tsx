import type { MouseEvent } from 'react'

export default function VoteButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (onClick) onClick()
  }
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="mt-3 inline-flex items-center justify-center rounded-lg px-3 py-2 text-white font-medium bg-brand hover:opacity-95 active:opacity-90 transition disabled:opacity-50"
    >
      Vote
    </button>
  )
}


