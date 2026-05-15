import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  CATEGORIAS,
  FECHA_ACTUAL,
  PRODUCTOS_TOP,
  SUCURSALES,
  VENTAS,
  addDays,
  type Categoria,
  type Sucursal,
  type VentaDiaria,
} from '@/data/mockData'

export type Periodo = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'año'
export type SucursalFiltro = 'todas' | Sucursal
export type CategoriaFiltro = 'todas' | Categoria
export type CompararCon = 'periodo-anterior' | 'año-anterior'

interface Rango {
  desde: string
  hasta: string
  largo: number
}

const LARGOS_PERIODO: Record<Periodo, number> = {
  hoy: 1,
  semana: 7,
  mes: 30,
  trimestre: 90,
  año: 365,
}

export const ETIQUETAS_PERIODO: Record<Periodo, string> = {
  hoy: 'Hoy',
  semana: 'Semana',
  mes: 'Mes',
  trimestre: 'Trimestre',
  año: 'Año',
}

export const ETIQUETAS_COMPARACION: Record<CompararCon, string> = {
  'periodo-anterior': 'período anterior',
  'año-anterior': 'año anterior',
}

export const useDashboardStore = defineStore('dashboard', () => {
  const periodo = ref<Periodo>('mes')
  const sucursal = ref<SucursalFiltro>('todas')
  const categoria = ref<CategoriaFiltro>('todas')
  const compararCon = ref<CompararCon>('periodo-anterior')

  // Catalogs for the FilterBar selects. These are plain readonly arrays —
  // not refs, not computed. storeToRefs() ignores non-reactive properties,
  // so consumers must destructure them directly from the store:
  //
  //   const store = useDashboardStore()
  //   const { opcionesSucursal } = store                  // OK
  //   const { periodo } = storeToRefs(store)              // OK for state
  //
  // Pulling these via storeToRefs returns undefined and silently breaks the
  // dropdowns. Keep them on the store, but always destructure from `store`.
  const opcionesSucursal: readonly SucursalFiltro[] = ['todas', ...SUCURSALES]
  const opcionesCategoria: readonly CategoriaFiltro[] = ['todas', ...CATEGORIAS]

  const rangoActual = computed<Rango>(() => {
    const largo = LARGOS_PERIODO[periodo.value]
    const hasta = FECHA_ACTUAL
    const desde = addDays(hasta, -(largo - 1))
    return { desde, hasta, largo }
  })

  const rangoComparacion = computed<Rango>(() => {
    const actual = rangoActual.value
    if (compararCon.value === 'año-anterior') {
      return {
        desde: addDays(actual.desde, -365),
        hasta: addDays(actual.hasta, -365),
        largo: actual.largo,
      }
    }
    return {
      desde: addDays(actual.desde, -actual.largo),
      hasta: addDays(actual.desde, -1),
      largo: actual.largo,
    }
  })

  function filtrar(rango: Rango): VentaDiaria[] {
    const out: VentaDiaria[] = []
    for (const fila of VENTAS) {
      if (fila.fecha < rango.desde || fila.fecha > rango.hasta) continue
      if (sucursal.value !== 'todas' && fila.sucursal !== sucursal.value) continue
      if (categoria.value !== 'todas' && fila.categoria !== categoria.value) continue
      out.push(fila)
    }
    return out
  }

  const filasActual = computed(() => filtrar(rangoActual.value))
  const filasComparacion = computed(() => filtrar(rangoComparacion.value))

  function totales(filas: VentaDiaria[]) {
    let ventas = 0
    let costo = 0
    let transacciones = 0
    let transaccionesFrecuentes = 0
    for (const f of filas) {
      ventas += f.ventas
      costo += f.costo
      transacciones += f.transacciones
      transaccionesFrecuentes += f.transaccionesFrecuentes
    }
    return { ventas, costo, transacciones, transaccionesFrecuentes }
  }

  const totalesActual = computed(() => totales(filasActual.value))
  const totalesComparacion = computed(() => totales(filasComparacion.value))

  function deltaPct(actual: number, anterior: number): number {
    if (anterior === 0) return 0
    return ((actual - anterior) / anterior) * 100
  }

  const ventasTotales = computed(() => ({
    valor: totalesActual.value.ventas,
    delta: deltaPct(totalesActual.value.ventas, totalesComparacion.value.ventas),
  }))

  const ticketPromedio = computed(() => {
    const ta = totalesActual.value
    const tc = totalesComparacion.value
    const ahora = ta.transacciones === 0 ? 0 : ta.ventas / ta.transacciones
    const antes = tc.transacciones === 0 ? 0 : tc.ventas / tc.transacciones
    return { valor: ahora, delta: deltaPct(ahora, antes) }
  })

  const transacciones = computed(() => ({
    valor: totalesActual.value.transacciones,
    delta: deltaPct(totalesActual.value.transacciones, totalesComparacion.value.transacciones),
  }))

  const margenBruto = computed(() => {
    const ta = totalesActual.value
    const tc = totalesComparacion.value
    const ahora = ta.ventas === 0 ? 0 : ((ta.ventas - ta.costo) / ta.ventas) * 100
    const antes = tc.ventas === 0 ? 0 : ((tc.ventas - tc.costo) / tc.ventas) * 100
    // Delta expressed in percentage points, not relative %.
    return { valor: ahora, delta: ahora - antes }
  })

  function serieDiaria(filas: VentaDiaria[], rango: Rango): { fecha: string; ventas: number }[] {
    const acumulado = new Map<string, number>()
    for (const f of filas) {
      acumulado.set(f.fecha, (acumulado.get(f.fecha) ?? 0) + f.ventas)
    }
    const result: { fecha: string; ventas: number }[] = []
    for (let i = 0; i < rango.largo; i++) {
      const fecha = addDays(rango.desde, i)
      result.push({ fecha, ventas: acumulado.get(fecha) ?? 0 })
    }
    return result
  }

  const serieActual = computed(() => serieDiaria(filasActual.value, rangoActual.value))
  const serieComparacion = computed(() =>
    serieDiaria(filasComparacion.value, rangoComparacion.value),
  )

  const ventasPorCategoria = computed(() => {
    const map = new Map<Categoria, number>()
    for (const c of CATEGORIAS) map.set(c, 0)
    for (const f of filasActual.value) {
      map.set(f.categoria, (map.get(f.categoria) ?? 0) + f.ventas)
    }
    const total = totalesActual.value.ventas
    const rows = Array.from(map.entries()).map(([cat, v]) => ({
      categoria: cat,
      ventas: v,
      participacion: total === 0 ? 0 : (v / total) * 100,
    }))
    rows.sort((a, b) => b.ventas - a.ventas)
    return rows
  })

  const ventasPorSucursal = computed(() => {
    const map = new Map<Sucursal, number>()
    for (const s of SUCURSALES) map.set(s, 0)
    for (const f of filasActual.value) {
      map.set(f.sucursal, (map.get(f.sucursal) ?? 0) + f.ventas)
    }
    const rows = Array.from(map.entries()).map(([suc, v]) => ({ sucursal: suc, ventas: v }))
    rows.sort((a, b) => b.ventas - a.ventas)
    return rows
  })

  const composicionClientes = computed(() => {
    const t = totalesActual.value
    const frecuentes = t.transaccionesFrecuentes
    const ocasionales = Math.max(0, t.transacciones - t.transaccionesFrecuentes)
    const total = frecuentes + ocasionales
    return {
      frecuentes,
      ocasionales,
      total,
      pctFrecuentes: total === 0 ? 0 : (frecuentes / total) * 100,
    }
  })

  const topProductos = computed(() => {
    const base =
      categoria.value === 'todas'
        ? PRODUCTOS_TOP
        : PRODUCTOS_TOP.filter((p) => p.categoria === categoria.value)
    return base.slice(0, 5)
  })

  return {
    periodo,
    sucursal,
    categoria,
    compararCon,
    opcionesSucursal,
    opcionesCategoria,
    rangoActual,
    rangoComparacion,
    filasActual,
    filasComparacion,
    ventasTotales,
    ticketPromedio,
    transacciones,
    margenBruto,
    serieActual,
    serieComparacion,
    ventasPorCategoria,
    ventasPorSucursal,
    composicionClientes,
    topProductos,
  }
})
