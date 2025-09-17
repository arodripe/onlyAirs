export default function VoteButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      className="mt-3 inline-flex items-center justify-center rounded-lg px-3 py-2 text-white font-medium bg-brand hover:opacity-95 active:opacity-90 transition disabled:opacity-50"
    >
      Vote
    </button>
  )
}


