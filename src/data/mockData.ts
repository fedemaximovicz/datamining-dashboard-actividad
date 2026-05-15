// Single fact table for the dashboard. Generated deterministically from a
// fixed FECHA_ACTUAL so the numbers stay stable across reloads.

export const FECHA_ACTUAL = '2026-05-14'

export const SUCURSALES = [
  'Posadas',
  'Oberá',
  'Eldorado',
  'Jardín América',
  'Iguazú',
] as const

export const CATEGORIAS = [
  'Almacén',
  'Frutas y verduras',
  'Carnes y pescados',
  'Lácteos',
  'Panadería',
  'Bebidas',
  'Congelados',
  'Limpieza',
] as const

export type Sucursal = (typeof SUCURSALES)[number]
export type Categoria = (typeof CATEGORIAS)[number]

export interface VentaDiaria {
  fecha: string // YYYY-MM-DD
  sucursal: Sucursal
  categoria: Categoria
  ventas: number
  costo: number
  transacciones: number
  transaccionesFrecuentes: number
  unidades: number
}

const PESOS_SUCURSAL: Record<Sucursal, number> = {
  Posadas: 1.3,
  Iguazú: 1.2,
  Eldorado: 1.0,
  Oberá: 0.95,
  'Jardín América': 0.8,
}

const PESOS_CATEGORIA: Record<Categoria, number> = {
  Almacén: 1.4,
  'Carnes y pescados': 1.25,
  'Frutas y verduras': 1.15,
  Bebidas: 1.1,
  Lácteos: 1.05,
  Congelados: 0.85,
  Limpieza: 0.75,
  Panadería: 0.7,
}

// Gross margin per category — used to derive costo from ventas.
const MARGENES: Record<Categoria, number> = {
  Panadería: 0.4,
  Limpieza: 0.32,
  Bebidas: 0.3,
  'Frutas y verduras': 0.28,
  Congelados: 0.25,
  Almacén: 0.22,
  Lácteos: 0.2,
  'Carnes y pescados': 0.18,
}

// Loyal-customer share per sucursal (used for transaccionesFrecuentes).
const FRECUENCIA_SUCURSAL: Record<Sucursal, number> = {
  Posadas: 0.55,
  Iguazú: 0.42,
  Eldorado: 0.5,
  Oberá: 0.52,
  'Jardín América': 0.58,
}

const DIAS_HISTORICOS = 400
const VENTAS_BASE_POR_FILA = 1_000_000
const TRANSACCIONES_BASE_POR_FILA = 35
const UNIDADES_POR_TRANSACCION = 5.5

function parseDate(s: string): Date {
  const parts = s.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  return new Date(Date.UTC(y, m - 1, d))
}

function formatDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(s: string, n: number): string {
  const d = parseDate(s)
  d.setUTCDate(d.getUTCDate() + n)
  return formatDate(d)
}

export function diffDays(later: string, earlier: string): number {
  const a = parseDate(later).getTime()
  const b = parseDate(earlier).getTime()
  return Math.round((a - b) / 86_400_000)
}

export function isoWeekday(s: string): number {
  // 0 = Sunday ... 6 = Saturday
  return parseDate(s).getUTCDay()
}

// Mulberry32: small, deterministic PRNG so the generator is reproducible.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

function generarVentas(): VentaDiaria[] {
  const filas: VentaDiaria[] = []
  const rng = mulberry32(20260514)

  for (let offset = DIAS_HISTORICOS - 1; offset >= 0; offset--) {
    const fecha = addDays(FECHA_ACTUAL, -offset)
    const dow = isoWeekday(fecha)
    const finDeSemana = dow === 0 || dow === 6
    const factorFinDeSemana = finDeSemana ? 1.25 : 1.0

    // Year-over-year trend: ~12% growth — older rows scaled down accordingly.
    const yearsAtras = offset / 365
    const factorTendencia = Math.pow(1.12, -yearsAtras)

    for (const sucursal of SUCURSALES) {
      const pesoSucursal = PESOS_SUCURSAL[sucursal]
      const frecuenciaBase = FRECUENCIA_SUCURSAL[sucursal]

      for (const categoria of CATEGORIAS) {
        const pesoCategoria = PESOS_CATEGORIA[categoria]
        const margen = MARGENES[categoria]

        const ruidoVentas = 0.85 + rng() * 0.3 // ±15%
        const ruidoTx = 0.85 + rng() * 0.3
        const ruidoFrec = 0.9 + rng() * 0.2

        const ventas =
          VENTAS_BASE_POR_FILA *
          pesoSucursal *
          pesoCategoria *
          factorFinDeSemana *
          factorTendencia *
          ruidoVentas

        const costo = ventas * (1 - margen)

        // Transactions track sales but with a softer category effect so
        // ticket promedio doesn't explode for heavy categories.
        const transacciones = Math.max(
          1,
          Math.round(
            TRANSACCIONES_BASE_POR_FILA *
              pesoSucursal *
              Math.sqrt(pesoCategoria) *
              factorFinDeSemana *
              factorTendencia *
              ruidoTx,
          ),
        )

        const transaccionesFrecuentes = Math.min(
          transacciones,
          Math.round(transacciones * frecuenciaBase * ruidoFrec),
        )

        const unidades = Math.round(transacciones * UNIDADES_POR_TRANSACCION * (0.9 + rng() * 0.2))

        filas.push({
          fecha,
          sucursal,
          categoria,
          ventas: Math.round(ventas),
          costo: Math.round(costo),
          transacciones,
          transaccionesFrecuentes,
          unidades,
        })
      }
    }
  }

  return filas
}

export const VENTAS: readonly VentaDiaria[] = generarVentas()

export interface ProductoTop {
  nombre: string
  categoria: Categoria
  ventas: number
  cambio: number // % change vs previous period
}

export const PRODUCTOS_TOP: readonly ProductoTop[] = [
  { nombre: 'Leche entera La Serenísima 1L', categoria: 'Lácteos', ventas: 184_500_000, cambio: 8.4 },
  { nombre: 'Cerveza Quilmes Cristal 1L', categoria: 'Bebidas', ventas: 162_300_000, cambio: 12.1 },
  { nombre: 'Asado de tira premium', categoria: 'Carnes y pescados', ventas: 148_700_000, cambio: -3.2 },
  { nombre: 'Pan francés del día', categoria: 'Panadería', ventas: 121_900_000, cambio: 5.6 },
  { nombre: 'Manzana roja Río Negro x kg', categoria: 'Frutas y verduras', ventas: 109_400_000, cambio: 2.8 },
  { nombre: 'Yerba Taragüi 1kg', categoria: 'Almacén', ventas: 98_200_000, cambio: 15.3 },
  { nombre: 'Detergente Skip 3L', categoria: 'Limpieza', ventas: 87_600_000, cambio: -1.4 },
  { nombre: 'Helado Frigor 1kg', categoria: 'Congelados', ventas: 74_800_000, cambio: 22.7 },
  { nombre: 'Pan lactal Bimbo 540g', categoria: 'Panadería', ventas: 68_500_000, cambio: 4.1 },
  { nombre: 'Aceite Natura girasol 1.5L', categoria: 'Almacén', ventas: 64_200_000, cambio: -6.8 },
]
