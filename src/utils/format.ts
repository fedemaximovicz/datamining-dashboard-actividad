const fmtARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const fmtARSCompact = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const fmtNumber = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

const fmtNumberCompact = new Intl.NumberFormat('es-AR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const fmtPercent = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

const fmtDateShort = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' })

export function formatARS(n: number): string {
  return Math.abs(n) >= 1_000_000 ? fmtARSCompact.format(n) : fmtARS.format(n)
}

export function formatARSCompact(n: number): string {
  return fmtARSCompact.format(n)
}

export function formatNumber(n: number): string {
  return Math.abs(n) >= 100_000 ? fmtNumberCompact.format(n) : fmtNumber.format(n)
}

export function formatPercent(n: number, fractionDigits = 1): string {
  if (fractionDigits === 1) return `${fmtPercent.format(n)}%`
  return `${n.toFixed(fractionDigits)}%`
}

export function formatDateShort(isoDate: string): string {
  const parts = isoDate.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  return fmtDateShort.format(new Date(Date.UTC(y, m - 1, d)))
}
