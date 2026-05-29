<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { standings } = storeToRefs(store)

const POR_PAGINA = 10
const pagina = ref(0)

const totalPaginas = computed(() => Math.max(1, Math.ceil(standings.value.length / POR_PAGINA)))

const filasPagina = computed(() =>
  standings.value.slice(pagina.value * POR_PAGINA, (pagina.value + 1) * POR_PAGINA),
)

// Al cambiar de carrera/equipo se vuelve a la primera página.
watch(standings, () => {
  pagina.value = 0
})

function irA(p: number) {
  pagina.value = Math.min(Math.max(p, 0), totalPaginas.value - 1)
}
</script>

<template>
  <DashboardCard title="Posiciones finales" subtitle="Clasificación de la carrera">
    <div class="table-wrapper">
      <table class="standings">
        <thead>
          <tr>
            <th class="col-pos">Pos</th>
            <th class="col-driver">Piloto</th>
            <th class="col-team">Equipo</th>
            <th class="col-pts">Pts</th>
            <th class="col-gap">Gap</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fila in filasPagina"
            :key="fila.driverNumber"
            :class="{ highlight: fila.esDelEquipo }"
            :style="fila.esDelEquipo ? { '--accent': fila.teamColour } : undefined"
          >
            <td class="col-pos">{{ fila.position ?? '—' }}</td>
            <td class="col-driver">
              <span class="acronym">{{ fila.acronym }}</span>
              <span class="fullname">{{ fila.fullName }}</span>
            </td>
            <td class="col-team">
              <span class="team-dot" :style="{ background: fila.teamColour }" />
              {{ fila.teamName }}
            </td>
            <td class="col-pts">{{ fila.points ?? 0 }}</td>
            <td class="col-gap" :class="{ status: fila.estado !== 'OK' }">{{ fila.gapLabel }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPaginas > 1" class="pager">
      <button type="button" class="pager-btn" :disabled="pagina === 0" @click="irA(pagina - 1)">
        ‹
      </button>
      <button
        v-for="p in totalPaginas"
        :key="p"
        type="button"
        class="pager-btn"
        :class="{ active: pagina === p - 1 }"
        @click="irA(p - 1)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        class="pager-btn"
        :disabled="pagina === totalPaginas - 1"
        @click="irA(pagina + 1)"
      >
        ›
      </button>
    </nav>
  </DashboardCard>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.standings {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.standings thead th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b8d98;
  font-weight: 600;
  padding: 0 12px 10px;
}

.standings tbody td {
  padding: 9px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #f2f2f7;
  vertical-align: middle;
}

.col-pos {
  width: 44px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.col-pts,
.col-gap {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.acronym {
  font-weight: 700;
  margin-right: 8px;
}

.fullname {
  color: #9aa0ad;
}

.team-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 8px;
  vertical-align: middle;
}

.col-gap.status {
  color: #fca5a5;
  font-weight: 600;
}

tr.highlight td {
  background: color-mix(in srgb, var(--accent) 22%, transparent);
}

tr.highlight td:first-child {
  box-shadow: inset 3px 0 0 var(--accent);
}

tr.highlight .fullname {
  color: #f8fafc;
  font-weight: 600;
}

.pager {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
}

.pager-btn {
  appearance: none;
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #26262f;
  color: #c7cad3;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.pager-btn:hover:not(:disabled):not(.active) {
  background: #2f2f3a;
  color: #f2f2f7;
}

.pager-btn.active {
  background: #e10600;
  border-color: #e10600;
  color: #ffffff;
}

.pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .fullname {
    display: none;
  }
}
</style>
