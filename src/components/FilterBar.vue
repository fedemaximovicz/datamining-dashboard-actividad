<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  ETIQUETAS_PERIODO,
  useDashboardStore,
  type Periodo,
} from '@/stores/dashboard'

const store = useDashboardStore()

// IMPORTANT: storeToRefs only extracts reactive properties (refs / reactive /
// computed). The catalog arrays `opcionesSucursal` / `opcionesCategoria` are
// plain readonly arrays, so they must be destructured directly from the store.
// Pulling them via storeToRefs returns undefined and the <select> options
// render empty without any warning.
const { periodo, sucursal, categoria, compararCon } = storeToRefs(store)
const { opcionesSucursal, opcionesCategoria } = store

const PERIODOS: readonly Periodo[] = ['hoy', 'semana', 'mes', 'trimestre', 'año']

function labelOpcion(opcion: string): string {
  return opcion === 'todas' ? 'Todas' : opcion
}
</script>

<template>
  <div class="filter-bar">
    <div class="filter-group">
      <span class="filter-label">Período</span>
      <div class="segmented">
        <button
          v-for="opt in PERIODOS"
          :key="opt"
          type="button"
          class="segmented-btn"
          :class="{ active: periodo === opt }"
          @click="periodo = opt"
        >
          {{ ETIQUETAS_PERIODO[opt] }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-sucursal">Sucursal</label>
      <select id="filter-sucursal" v-model="sucursal" class="select">
        <option v-for="opt in opcionesSucursal" :key="opt" :value="opt">
          {{ labelOpcion(opt) }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-categoria">Categoría</label>
      <select id="filter-categoria" v-model="categoria" class="select">
        <option v-for="opt in opcionesCategoria" :key="opt" :value="opt">
          {{ labelOpcion(opt) }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filter-comparar">Comparar con</label>
      <select id="filter-comparar" v-model="compararCon" class="select">
        <option value="periodo-anterior">Período anterior</option>
        <option value="año-anterior">Año anterior</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(243, 246, 252, 0.92);
  backdrop-filter: blur(8px);
  padding: 14px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: flex-end;
  margin-bottom: 18px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.filter-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.segmented {
  display: inline-flex;
  background: #ffffff;
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  gap: 2px;
}

.segmented-btn {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-radius: 7px;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}

.segmented-btn:hover:not(.active) {
  color: #0f172a;
}

.segmented-btn.active {
  background: #0f172a;
  color: #ffffff;
}

.select {
  appearance: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  color: #0f172a;
  font-family: inherit;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  min-width: 180px;
}

.select:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
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
