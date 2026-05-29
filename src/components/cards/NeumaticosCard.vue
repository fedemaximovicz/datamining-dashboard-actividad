<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { COMPUESTOS_LEYENDA, compuestoColor, compuestoInfo } from '@/utils/tyres'

const store = useDashboardStore()
const { stintsEquipo } = storeToRefs(store)

const maxStints = computed(() =>
  stintsEquipo.value.reduce((m, p) => Math.max(m, p.stints.length), 0),
)

const chartData = computed<ChartData<'bar'>>(() => {
  const labels = stintsEquipo.value.map((p) => p.acronym)
  const datasets = []
  for (let i = 0; i < maxStints.value; i++) {
    datasets.push({
      label: `Stint ${i + 1}`,
      data: stintsEquipo.value.map((p) => p.stints[i]?.laps ?? 0),
      backgroundColor: stintsEquipo.value.map((p) => compuestoColor(p.stints[i]?.compound)),
      borderColor: '#1f1f27',
      borderWidth: 2,
      borderRadius: 4,
    })
  }
  return { labels, datasets }
})

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
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
          const item = items[0]
          if (!item) return ''
          const piloto = stintsEquipo.value[item.dataIndex]
          const stint = piloto?.stints[item.datasetIndex]
          if (!stint) return ''
          return `${piloto.acronym} · vueltas ${stint.lapStart}–${stint.lapEnd}`
        },
        label(ctx) {
          const stint = stintsEquipo.value[ctx.dataIndex]?.stints[ctx.datasetIndex]
          if (!stint) return ''
          const info = compuestoInfo(stint.compound)
          return ` ${info.label} · ${stint.laps} vueltas`
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      title: { display: true, text: 'Vuelta', color: '#8b8d98', font: { size: 11 } },
      grid: { color: 'rgba(255, 255, 255, 0.08)' },
      border: { display: false },
      ticks: { precision: 0, color: '#8b8d98', font: { size: 11 } },
    },
    y: {
      stacked: true,
      grid: { display: false },
      ticks: { color: '#f2f2f7', font: { size: 13, weight: 700 } },
    },
  },
}))
</script>

<template>
  <DashboardCard title="Neumáticos y paradas" subtitle="Stints por piloto; cada corte es una parada en boxes">
    <div v-if="stintsEquipo.length" class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="empty">Sin datos de stints para este equipo.</p>

    <ul class="legend">
      <li v-for="c in COMPUESTOS_LEYENDA" :key="c.key">
        <span class="swatch" :style="{ background: c.color }" />
        {{ c.label }}
      </li>
    </ul>
  </DashboardCard>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 180px;
  width: 100%;
}

.empty {
  color: #8b8d98;
  font-size: 13px;
  padding: 24px 0;
  text-align: center;
}

.legend {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 12px;
  color: #9aa0ad;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 6px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
