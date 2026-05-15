<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    delta: number
    unidad?: 'pct' | 'pp'
  }>(),
  { unidad: 'pct' },
)

const isPositive = computed(() => props.delta >= 0)

const label = computed(() => {
  const abs = Math.abs(props.delta)
  const sign = props.delta >= 0 ? '+' : '−'
  const suffix = props.unidad === 'pp' ? ' pp' : '%'
  return `${sign}${abs.toFixed(1)}${suffix}`
})
</script>

<template>
  <span class="trend-badge" :class="{ negative: !isPositive }">
    <span class="arrow">{{ isPositive ? '↑' : '↓' }}</span>
    {{ label }}
  </span>
</template>

<style scoped>
.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
  line-height: 1.4;
  white-space: nowrap;
}

.trend-badge.negative {
  background: rgba(220, 38, 38, 0.12);
  color: #dc2626;
}

.arrow {
  font-size: 11px;
  line-height: 1;
}
</style>
