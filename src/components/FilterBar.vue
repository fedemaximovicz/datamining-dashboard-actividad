<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

// storeToRefs solo extrae propiedades reactivas. `aniosDisponibles` es un array
// readonly plano, así que se desestructura directamente del store.
const { anio, meetingKey, equipo, eventos, equipos, cargandoEventos, cargandoEquipos } =
  storeToRefs(store)
const { aniosDisponibles } = store
</script>

<template>
  <div class="filter-bar">
    <div class="filter-group">
      <label class="filter-label" for="filter-anio">Año</label>
      <select id="filter-anio" v-model="anio" class="select">
        <option :value="null" disabled>Selecciona un año</option>
        <option v-for="a in aniosDisponibles" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-evento">Evento</label>
      <select id="filter-evento" v-model="meetingKey" class="select" :disabled="!anio || cargandoEventos">
        <option :value="null" disabled>
          {{ cargandoEventos ? 'Cargando eventos…' : anio ? 'Selecciona un evento' : 'Elegí un año primero' }}
        </option>
        <option v-for="ev in eventos" :key="ev.meetingKey" :value="ev.meetingKey">
          {{ ev.label }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-equipo">Equipo</label>
      <select id="filter-equipo" v-model="equipo" class="select" :disabled="!meetingKey || cargandoEquipos">
        <option :value="null" disabled>
          {{ cargandoEquipos ? 'Cargando equipos…' : meetingKey ? 'Selecciona un equipo' : 'Elegí un evento primero' }}
        </option>
        <option v-for="t in equipos" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  padding: 14px 0 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: flex-end;
  margin-bottom: 18px;
  border-bottom: 1px solid #eef2f7;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.filter-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.select {
  appearance: none;
  background: #f1f4f9;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 32px 8px 14px;
  font-size: 13px;
  color: #0f172a;
  font-weight: 500;
  font-family: inherit;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  min-width: 220px;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.select:hover:not(:disabled) {
  background-color: #e8edf5;
}

.select:focus {
  outline: 0;
  border-color: #2563eb;
}

.select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .filter-bar {
    gap: 12px;
  }
  .select {
    min-width: 0;
    width: 100%;
  }
  .filter-group {
    flex: 1 1 calc(50% - 12px);
  }
  .filter-group:first-child {
    flex-basis: 100%;
  }
}
</style>
