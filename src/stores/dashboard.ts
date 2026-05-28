import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface OpcionEvento {
  meetingKey: number
  label: string
}

// Años con datos disponibles en OpenF1 (orden descendente). La lista de eventos
// y equipos se llena desde la API en la fase 3.
const ANIOS_DISPONIBLES: readonly number[] = [2026, 2025, 2024, 2023]

export const useDashboardStore = defineStore('dashboard', () => {
  // --- Selección de filtros ---
  const anio = ref<number | null>(null)
  const meetingKey = ref<number | null>(null)
  const equipo = ref<string | null>(null)

  // --- Opciones de los filtros ---
  const aniosDisponibles = ANIOS_DISPONIBLES
  // Placeholder: en la fase 3 se llenan desde la API al cambiar año / evento.
  const eventos = ref<OpcionEvento[]>([])
  const equipos = ref<string[]>([])

  return {
    anio,
    meetingKey,
    equipo,
    aniosDisponibles,
    eventos,
    equipos,
  }
})
