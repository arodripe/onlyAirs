export default function HeartCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-brand">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.173-.704 25.18 25.18 0 01-4.358-3.185C3.112 15.06 1.5 12.67 1.5 10.034 1.5 7.497 3.455 5.5 6 5.5c1.494 0 2.73.534 3.714 1.617A5.373 5.373 0 0113.5 5.5c2.545 0 4.5 1.997 4.5 4.534 0 2.636-1.612 5.026-4.585 6.972a25.18 25.18 0 01-4.358 3.185 15.247 15.247 0 01-1.173.704l-.022.012-.007.003-.003.002a.75.75 0 01-.698 0l-.003-.002z"/>
      </svg>
      <span className="font-medium">{count}</span>
    </span>
  )
}


