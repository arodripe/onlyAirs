// Simple emoji flag fallback using regional indicator symbols
export default function CountryFlag({ code }: { code: string }) {
  const flag = codeToEmoji((code || 'US').toUpperCase())
  return <span title={code} aria-label={code}>{flag}</span>
}

function codeToEmoji(code: string) {
  if (code.length !== 2) return '🏳️'
  const A = 127397
  return String.fromCodePoint(...code.split('').map(c => A + c.charCodeAt(0)))
}


