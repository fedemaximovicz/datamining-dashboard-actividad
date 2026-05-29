import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getDrivers, getMeetings, getRaceSession } from '@/api/openf1'
import type { Driver, Session } from '@/types/f1'

export interface OpcionEvento {
  meetingKey: number
  label: string
}

// Años con datos disponibles en OpenF1 (orden descendente).
const ANIOS_DISPONIBLES: readonly number[] = [2026, 2025, 2024, 2023]

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

  // --- Estado de carga / error ---
  const cargandoEventos = ref(false)
  const cargandoEquipos = ref(false)
  const error = ref<string | null>(null)

  // Pilotos del equipo seleccionado (normalmente 2).
  const pilotosEquipo = computed(() =>
    equipo.value ? drivers.value.filter((d) => d.team_name === equipo.value) : [],
  )

  function mensajeError(e: unknown): string {
    return e instanceof Error ? e.message : 'Error al consultar OpenF1'
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
    cargandoEventos,
    cargandoEquipos,
    error,
  }
})
