const fmtDateShort = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })

export function formatDateShort(isoDate: string): string {
  const parts = isoDate.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  return fmtDateShort.format(new Date(Date.UTC(y, m - 1, d)))
}

// Formatea una duración de vuelta en segundos como m:ss.mmm (ej. 92.345 -> "1:32.345").
export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  const min = Math.floor(seconds / 60)
  const sec = seconds - min * 60
  return `${min}:${sec.toFixed(3).padStart(6, '0')}`
}

export function formatGap(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  return `+${seconds.toFixed(3)}`
}

export function ordinal(n: number): string {
  return `${n}.º`
}
