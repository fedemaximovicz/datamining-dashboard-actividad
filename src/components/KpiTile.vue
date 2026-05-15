<script setup lang="ts">
import TrendBadge from './TrendBadge.vue'

defineProps<{
  label: string
  valor: string
  delta: number
  unidadDelta?: 'pct' | 'pp'
  comparacionLabel: string
}>()
</script>

<template>
  <div class="kpi-tile">
    <span class="kpi-label">{{ label }}</span>
    <span class="kpi-value">{{ valor }}</span>
    <div class="kpi-meta">
      <TrendBadge :delta="delta" :unidad="unidadDelta" />
      <span class="comparison-label">vs {{ comparacionLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.kpi-tile {
  background: #f1f4f9;
  border-radius: 18px;
  padding: 22px 24px;
  border: 1px solid rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 130px;
}

.kpi-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.kpi-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.comparison-label {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 720px) {
  .kpi-value {
    font-size: 26px;
  }
}
</style>
