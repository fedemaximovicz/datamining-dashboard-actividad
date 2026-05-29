// Colores y etiquetas de los compuestos de neumáticos de F1.

interface CompuestoInfo {
  label: string
  color: string
  text: string
}

const COMPUESTOS: Record<string, CompuestoInfo> = {
  SOFT: { label: 'Blando', color: '#da291c', text: '#ffffff' },
  MEDIUM: { label: 'Medio', color: '#f7d000', text: '#0f172a' },
  HARD: { label: 'Duro', color: '#e8e8e8', text: '#0f172a' },
  INTERMEDIATE: { label: 'Intermedio', color: '#43b02a', text: '#ffffff' },
  WET: { label: 'Lluvia', color: '#0067ad', text: '#ffffff' },
}

const DESCONOCIDO: CompuestoInfo = { label: 'Desconocido', color: '#94a3b8', text: '#ffffff' }

export function compuestoInfo(compound: string | undefined): CompuestoInfo {
  if (!compound) return DESCONOCIDO
  return COMPUESTOS[compound.toUpperCase()] ?? DESCONOCIDO
}

export function compuestoColor(compound: string | undefined): string {
  return compuestoInfo(compound).color
}

export const COMPUESTOS_LEYENDA = Object.entries(COMPUESTOS).map(([key, info]) => ({
  key,
  label: info.label,
  color: info.color,
}))
