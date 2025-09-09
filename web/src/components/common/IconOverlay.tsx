type Corner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export default function IconsOverlay({ corner = 'top-right', children, className = '', bg = 'bg-black/35' }: { corner?: Corner; children: React.ReactNode; className?: string; bg?: string }) {
  const pos = corner === 'top-right' ? 'top-2 right-2' : corner === 'top-left' ? 'top-2 left-2' : corner === 'bottom-right' ? 'bottom-2 right-2' : 'bottom-2 left-2'
  return (
    <div className={`absolute ${pos} z-10 rounded-md ${bg} px-2 py-1 ${className}`}>
      {children}
    </div>
  )
}


