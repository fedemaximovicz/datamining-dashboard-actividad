import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  getDrivers,
  getLaps,
  getMeetings,
  getPositions,
  getRaceSession,
  getSessionResult,
  getStints,
} from '@/api/openf1'
import type { Driver, Lap, PositionRecord, Session, SessionResult, Stint } from '@/types/f1'

export interface OpcionEvento {
  meetingKey: number
  label: string
}

export interface FilaPosicion {
  position: number | null
  driverNumber: number
  acronym: string
  fullName: string
  teamName: string
  teamColour: string
  points: number | null
  gapLabel: string
  estado: 'OK' | 'DNF' | 'DNS' | 'DSQ'
  esDelEquipo: boolean
}

export interface PuntoVuelta {
  lap: number
  position: number
}

export interface SerieVueltas {
  driverNumber: number
  acronym: string
  fullName: string
  colour: string
  puntos: PuntoVuelta[]
}

export interface StintPiloto {
  stintNumber: number
  compound: string
  lapStart: number
  lapEnd: number
  laps: number
  tyreAgeAtStart: number | null
}

export interface StintsPiloto {
  driverNumber: number
  acronym: string
  fullName: string
  colour: string
  stints: StintPiloto[]
}

// Años con datos disponibles en OpenF1 (orden descendente).
const ANIOS_DISPONIBLES: readonly number[] = [2026, 2025, 2024, 2023]

function hashColour(colour: string | undefined): string {
  if (!colour) return '#64748b'
  return colour.startsWith('#') ? colour : `#${colour}`
}

// Para cada vuelta del piloto, la posición vigente al inicio de esa vuelta.
// Se cruza el inicio de cada vuelta (laps.date_start) con el último cambio de
// posición (position.date) anterior o igual a ese instante.
function derivarPosicionPorVuelta(laps: Lap[], positions: PositionRecord[]): PuntoVuelta[] {
  const lapsOrdenadas = [...laps]
    .filter((l) => l.lap_number != null && l.date_start != null)
    .sort((a, b) => a.lap_number - b.lap_number)
  const posOrdenadas = [...positions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const puntos: PuntoVuelta[] = []
  let idx = 0
  let posActual: number | null = null
  for (const lap of lapsOrdenadas) {
    const t = new Date(lap.date_start as string).getTime()
    let pos = posOrdenadas[idx]
    while (pos && new Date(pos.date).getTime() <= t) {
      posActual = pos.position
      idx++
      pos = posOrdenadas[idx]
    }
    if (posActual != null) puntos.push({ lap: lap.lap_number, position: posActual })
  }
  return puntos
}

export const useDashboardStore = defineStore('dashboard', () => {
  // --- Selección de filtros ---
  const anio = ref<number | null>(null)
  const meetingKey = ref<number | null>(null)
  const equipo = ref<string | null>(null)

  // --- Opciones / datos de los filtros ---
  const aniosDisponibles = ANIOS_DISPONIBLES
  const eventos = ref<OpcionEvento[]>([])
  const equipos = ref<string[]>([])

  // --- Datos resueltos de la selección actual ---
  const raceSession = ref<Session | null>(null)
  const drivers = ref<Driver[]>([])

  // --- Datos crudos de la carrera ---
  const sessionResults = ref<SessionResult[]>([])
  const lapsPorPiloto = ref<Record<number, Lap[]>>({})
  const positionsPorPiloto = ref<Record<number, PositionRecord[]>>({})
  const stintsPorPiloto = ref<Record<number, Stint[]>>({})

  // --- Estado de carga / error ---
  const cargandoEventos = ref(false)
  const cargandoEquipos = ref(false)
  const cargandoDatos = ref(false)
  const error = ref<string | null>(null)

  // Pilotos del equipo seleccionado (normalmente 2).
  const pilotosEquipo = computed(() =>
    equipo.value ? drivers.value.filter((d) => d.team_name === equipo.value) : [],
  )

  const driversPorNumero = computed(() => {
    const map = new Map<number, Driver>()
    for (const d of drivers.value) map.set(d.driver_number, d)
    return map
  })

  // Tabla de posiciones finales, con los pilotos del equipo marcados.
  const standings = computed<FilaPosicion[]>(() => {
    const filas = sessionResults.value.map((r): FilaPosicion => {
      const d = driversPorNumero.value.get(r.driver_number)
      const estado: FilaPosicion['estado'] = r.dsq
        ? 'DSQ'
        : r.dns
          ? 'DNS'
          : r.dnf
            ? 'DNF'
            : 'OK'
      let gapLabel = '—'
      if (estado !== 'OK') gapLabel = estado
      else if (r.position === 1) gapLabel = 'Líder'
      else if (typeof r.gap_to_leader === 'number') gapLabel = `+${r.gap_to_leader.toFixed(3)}`
      else if (typeof r.gap_to_leader === 'string') gapLabel = r.gap_to_leader

      return {
        position: r.position,
        driverNumber: r.driver_number,
        acronym: d?.name_acronym ?? String(r.driver_number),
        fullName: d?.full_name ?? `#${r.driver_number}`,
        teamName: d?.team_name ?? '',
        teamColour: hashColour(d?.team_colour),
        points: r.points ?? null,
        gapLabel,
        estado,
        esDelEquipo: d != null && d.team_name === equipo.value,
      }
    })
    return filas.sort((a, b) => {
      if (a.position == null) return 1
      if (b.position == null) return -1
      return a.position - b.position
    })
  })

  // Posición por vuelta de los pilotos del equipo.
  const posicionPorVuelta = computed<SerieVueltas[]>(() =>
    pilotosEquipo.value.map((d) => ({
      driverNumber: d.driver_number,
      acronym: d.name_acronym,
      fullName: d.full_name,
      colour: hashColour(d.team_colour),
      puntos: derivarPosicionPorVuelta(
        lapsPorPiloto.value[d.driver_number] ?? [],
        positionsPorPiloto.value[d.driver_number] ?? [],
      ),
    })),
  )

  // Stints de neumáticos de los pilotos del equipo (paradas en boxes).
  const stintsEquipo = computed<StintsPiloto[]>(() =>
    pilotosEquipo.value.map((d) => {
      const raw = [...(stintsPorPiloto.value[d.driver_number] ?? [])].sort(
        (a, b) => a.stint_number - b.stint_number,
      )
      return {
        driverNumber: d.driver_number,
        acronym: d.name_acronym,
        fullName: d.full_name,
        colour: hashColour(d.team_colour),
        stints: raw.map((s) => ({
          stintNumber: s.stint_number,
          compound: s.compound,
          lapStart: s.lap_start,
          lapEnd: s.lap_end,
          laps: s.lap_end - s.lap_start + 1,
          tyreAgeAtStart: s.tyre_age_at_start,
        })),
      }
    }),
  )

  const datosListos = computed(
    () => equipo.value != null && !cargandoDatos.value && sessionResults.value.length > 0,
  )

  function mensajeError(e: unknown): string {
    return e instanceof Error ? e.message : 'Error al consultar OpenF1'
  }

  function limpiarDatosCarrera() {
    sessionResults.value = []
    lapsPorPiloto.value = {}
    positionsPorPiloto.value = {}
    stintsPorPiloto.value = {}
  }

  // Año -> cargar eventos del año.
  watch(anio, async (nuevoAnio) => {
    meetingKey.value = null
    eventos.value = []
    error.value = null
    if (nuevoAnio == null) return

    cargandoEventos.value = true
    try {
      const meetings = await getMeetings(nuevoAnio)
      eventos.value = meetings
        // Se excluyen los tests de pretemporada (no tienen sesión de carrera).
        .filter((m) => !/testing/i.test(m.meeting_name))
        .map((m) => ({ meetingKey: m.meeting_key, label: m.meeting_name }))
    } catch (e) {
      error.value = mensajeError(e)
    } finally {
      cargandoEventos.value = false
    }
  })

  // Evento -> resolver sesión de carrera, cargar pilotos y derivar equipos.
  watch(meetingKey, async (nuevoMeeting) => {
    equipo.value = null
    equipos.value = []
    raceSession.value = null
    drivers.value = []
    error.value = null
    if (nuevoMeeting == null) return

    cargandoEquipos.value = true
    try {
      const session = await getRaceSession(nuevoMeeting)
      raceSession.value = session
      if (!session) {
        error.value = 'Este evento no tiene sesión de carrera disponible.'
        return
      }
      const pilotos = await getDrivers(session.session_key)
      drivers.value = pilotos
      equipos.value = Array.from(new Set(pilotos.map((d) => d.team_name))).sort((a, b) =>
        a.localeCompare(b),
      )
    } catch (e) {
      error.value = mensajeError(e)
    } finally {
      cargandoEquipos.value = false
    }
  })

  // Equipo -> traer datos de la carrera (clasificación, vueltas, posiciones, stints).
  watch(equipo, async (nuevoEquipo) => {
    limpiarDatosCarrera()
    error.value = null
    const session = raceSession.value
    if (nuevoEquipo == null || session == null) return

    const sessionKey = session.session_key
    const pilotos = drivers.value.filter((d) => d.team_name === nuevoEquipo)

    cargandoDatos.value = true
    try {
      const [resultados, ...porPiloto] = await Promise.all([
        getSessionResult(sessionKey),
        ...pilotos.map(async (d) => {
          const [laps, positions, stints] = await Promise.all([
            getLaps(sessionKey, d.driver_number),
            getPositions(sessionKey, d.driver_number),
            getStints(sessionKey, d.driver_number),
          ])
          return { driverNumber: d.driver_number, laps, positions, stints }
        }),
      ])

      // El watcher pudo dispararse de nuevo mientras esperábamos.
      if (equipo.value !== nuevoEquipo) return

      sessionResults.value = resultados
      const laps: Record<number, Lap[]> = {}
      const positions: Record<number, PositionRecord[]> = {}
      const stints: Record<number, Stint[]> = {}
      for (const p of porPiloto) {
        laps[p.driverNumber] = p.laps
        positions[p.driverNumber] = p.positions
        stints[p.driverNumber] = p.stints
      }
      lapsPorPiloto.value = laps
      positionsPorPiloto.value = positions
      stintsPorPiloto.value = stints
    } catch (e) {
      error.value = mensajeError(e)
    } finally {
      cargandoDatos.value = false
    }
  })

  return {
    anio,
    meetingKey,
    equipo,
    aniosDisponibles,
    eventos,
    equipos,
    raceSession,
    drivers,
    pilotosEquipo,
    standings,
    posicionPorVuelta,
    stintsEquipo,
    datosListos,
    cargandoEventos,
    cargandoEquipos,
    cargandoDatos,
    error,
  }
})
