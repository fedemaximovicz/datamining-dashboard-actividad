<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatARS, formatPercent } from '@/utils/format'

const store = useDashboardStore()
const { ventasPorCategoria } = storeToRefs(store)

const maxVentas = computed(() =>
  Math.max(...ventasPorCategoria.value.map((c) => c.ventas), 1),
)

function widthPct(ventas: number): string {
  return `${(ventas / maxVentas.value) * 100}%`
}
</script>

<template>
  <DashboardCard title="Ventas por categoría" subtitle="Distribución del período actual">
    <ul class="bar-list">
      <li v-for="row in ventasPorCategoria" :key="row.categoria" class="bar-row">
        <div class="bar-header">
          <span class="bar-label">{{ row.categoria }}</span>
          <span class="bar-value">
            {{ formatARS(row.ventas) }}
            <span class="bar-share">{{ formatPercent(row.participacion) }}</span>
          </span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: widthPct(row.ventas) }" />
        </div>
      </li>
    </ul>
  </DashboardCard>
</template>

<style scoped>
.bar-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
}

.bar-label {
  color: #0f172a;
  font-weight: 500;
}

.bar-value {
  color: #0f172a;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.bar-share {
  color: #94a3b8;
  font-weight: 500;
  margin-left: 6px;
  font-size: 12px;
}

.bar-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
  border-radius: 999px;
  transition: width 0.4s ease;
}
</style>
