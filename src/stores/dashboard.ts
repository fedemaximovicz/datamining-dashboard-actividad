import { ref } from 'vue'
import { defineStore } from 'pinia'

// Estado base del dashboard de F1. Por ahora solo guarda la selección de
// filtros (año, evento, equipo). La carga de datos desde OpenF1 se agrega en
// fases posteriores.
export const useDashboardStore = defineStore('dashboard', () => {
  const anio = ref<number | null>(null)
  const meetingKey = ref<number | null>(null)
  const equipo = ref<string | null>(null)

  return {
    anio,
    meetingKey,
    equipo,
  }
})
