export default function Header({ title, tagline }: { title: string; tagline?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/onlyAirFavIcon.svg" alt="OnlyAirs logo" className="h-14 w-14" />
          <div className="text-xl font-semibold tracking-tight brand-gradient-text -ml-4">{title}</div>
        </div>
        {tagline && <nav className="text-sm text-gray-600">{tagline}</nav>}
      </div>
    </header>
  )
}


