export default function Header({ title, tagline }: { title: string; tagline?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand"></div>
          <div className="text-xl font-semibold tracking-tight">{title}</div>
        </div>
        {tagline && <nav className="text-sm text-gray-600">{tagline}</nav>}
      </div>
    </header>
  )
}


