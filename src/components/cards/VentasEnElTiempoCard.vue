<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { ETIQUETAS_COMPARACION, useDashboardStore } from '@/stores/dashboard'
import { formatARS, formatARSCompact, formatDateShort } from '@/utils/format'

const store = useDashboardStore()
const { serieActual, serieComparacion, compararCon } = storeToRefs(store)

const labels = computed(() => serieActual.value.map((p) => formatDateShort(p.fecha)))

const chartData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Actual',
      data: serieActual.value.map((p) => p.ventas),
      borderColor: '#2563eb',
      backgroundColor: (ctx: ScriptableContext<'line'>) => {
        const { chart } = ctx
        const { ctx: c, chartArea } = chart
        if (!chartArea) return 'rgba(37, 99, 235, 0.15)'
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.28)')
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')
        return gradient
      },
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3,
      fill: true,
    },
    {
      label: ETIQUETAS_COMPARACION[compararCon.value],
      data: serieComparacion.value.map((p) => p.ventas),
      borderColor: '#94a3b8',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderDash: [4, 4],
      pointRadius: 0,
      pointHoverRadius: 3,
      tension: 0.3,
      fill: false,
    },
  ],
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
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12 },
        color: '#64748b',
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label(ctx) {
          return ` ${ctx.dataset.label}: ${formatARS(Number(ctx.parsed.y))}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8,
        color: '#94a3b8',
        font: { size: 11 },
      },
    },
    y: {
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: {
        color: '#94a3b8',
        font: { size: 11 },
        callback(v) {
          return formatARSCompact(Number(v))
        },
      },
    },
  },
}))
</script>

<template>
  <DashboardCard title="Ventas en el tiempo" subtitle="Evolución diaria comparada con el período de referencia">
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </DashboardCard>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 320px;
  width: 100%;
}

@media (max-width: 720px) {
  .chart-wrapper {
    height: 260px;
  }
}
</style>
