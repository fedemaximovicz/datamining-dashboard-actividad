<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { posicionPorVuelta } = storeToRefs(store)

const maxPos = computed(() => {
  let m = 1
  for (const s of posicionPorVuelta.value) {
    for (const p of s.puntos) if (p.position > m) m = p.position
  }
  return m
})

const chartData = computed<ChartData<'line'>>(() => ({
  datasets: posicionPorVuelta.value.map((serie, i) => ({
    label: serie.acronym,
    data: serie.puntos.map((p) => ({ x: p.lap, y: p.position })),
    borderColor: serie.colour,
    backgroundColor: serie.colour,
    borderWidth: 2.5,
    // Dos pilotos del mismo equipo comparten color: se distinguen con el trazo.
    borderDash: i === 0 ? [] : [6, 4],
    pointRadius: 0,
    pointHoverRadius: 4,
    tension: 0.25,
    fill: false,
  })),
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 24,
        usePointStyle: false,
        font: { size: 12 },
        color: '#c7cad3',
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#0b0b0f',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        title(items) {
          return `Vuelta ${items[0]?.parsed.x ?? ''}`
        },
        label(ctx) {
          return ` ${ctx.dataset.label}: P${ctx.parsed.y}`
        },
      },
    },
  },
  scales: {
    x: {
      type: 'linear',
      title: { display: true, text: 'Vuelta', color: '#8b8d98', font: { size: 11 } },
      grid: { display: false },
      ticks: { precision: 0, color: '#8b8d98', font: { size: 11 } },
    },
    y: {
      reverse: true,
      min: 1,
      max: maxPos.value,
      title: { display: true, text: 'Posición', color: '#8b8d98', font: { size: 11 } },
      grid: { color: 'rgba(255, 255, 255, 0.08)' },
      border: { display: false },
      ticks: { stepSize: 1, precision: 0, color: '#8b8d98', font: { size: 11 } },
    },
  },
}))
</script>

<template>
  <DashboardCard title="Posición por vuelta" subtitle="Evolución de los pilotos del equipo">
    <div v-if="posicionPorVuelta.length" class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="empty">Sin datos de posición para este equipo.</p>
  </DashboardCard>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 340px;
  width: 100%;
}

.empty {
  color: #8b8d98;
  font-size: 13px;
  padding: 24px 0;
  text-align: center;
}

@media (max-width: 720px) {
  .chart-wrapper {
    height: 280px;
  }
}
</style>
