<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatNumber, formatPercent } from '@/utils/format'

const store = useDashboardStore()
const { composicionClientes } = storeToRefs(store)

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['Clientes frecuentes', 'Clientes ocasionales'],
  datasets: [
    {
      data: [composicionClientes.value.frecuentes, composicionClientes.value.ocasionales],
      backgroundColor: ['#2563eb', '#cbd5e1'],
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '74%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label(ctx) {
          const value = Number(ctx.parsed)
          const total = composicionClientes.value.total
          const pct = total === 0 ? 0 : (value / total) * 100
          return ` ${ctx.label}: ${formatNumber(value)} (${formatPercent(pct)})`
        },
      },
    },
  },
}))

const centerPct = computed(() => formatPercent(composicionClientes.value.pctFrecuentes))
</script>

<template>
  <DashboardCard title="Composición de clientes" subtitle="Frecuentes vs ocasionales">
    <div class="composition">
      <div class="chart-wrapper">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="center-label">
          <span class="center-value">{{ centerPct }}</span>
          <span class="center-caption">frecuentes</span>
        </div>
      </div>
      <ul class="legend">
        <li class="legend-row">
          <span class="legend-dot frecuentes" />
          <span class="legend-name">Frecuentes</span>
          <span class="legend-value">{{ formatNumber(composicionClientes.frecuentes) }}</span>
        </li>
        <li class="legend-row">
          <span class="legend-dot ocasionales" />
          <span class="legend-name">Ocasionales</span>
          <span class="legend-value">{{ formatNumber(composicionClientes.ocasionales) }}</span>
        </li>
        <li class="legend-row total">
          <span class="legend-name">Total transacciones</span>
          <span class="legend-value">{{ formatNumber(composicionClientes.total) }}</span>
        </li>
      </ul>
    </div>
  </DashboardCard>
</template>

<style scoped>
.composition {
  display: grid;
  grid-template-columns: minmax(0, 160px) 1fr;
  gap: 18px;
  align-items: center;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 160px;
}

.center-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  gap: 2px;
}

.center-value {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.center-caption {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.legend-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.legend-row.total {
  grid-template-columns: 1fr auto;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  margin-top: 2px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.legend-dot.frecuentes {
  background: #2563eb;
}

.legend-dot.ocasionales {
  background: #cbd5e1;
}

.legend-name {
  color: #64748b;
}

.legend-value {
  color: #0f172a;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 720px) {
  .composition {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .legend {
    width: 100%;
  }
}
</style>
