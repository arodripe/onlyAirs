import IconsOverlay from '../common/IconOverlay'
import CountryFlag from '../common/CountryFlag'
import HeartCount from '../common/HeartCount'
import VoteButton from '../common/VoteButton'

export default function ChallengerCard({ title, fan, total, onVote }: { title: string; fan: any; total: number; onVote?: () => void }) {
  return (
    <div className="aspect-square border rounded-xl p-4 flex flex-col shadow-sm">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="font-medium">{title}</div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-md bg-gray-50">
        <img src={fan.imageUrl} alt={fan.displayName} className="object-cover w-full h-full" />
        <IconsOverlay corner="top-right">
          <span className="text-2xl leading-none"><CountryFlag code={fan.countryCode} /></span>
        </IconsOverlay>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="font-medium">{fan.displayName}</div>
        <div className="text-gray-600 flex items-center gap-2">
          <HeartCount count={total} />
        </div>
      </div>
      <VoteButton onClick={onVote} />
    </div>
  )
}


