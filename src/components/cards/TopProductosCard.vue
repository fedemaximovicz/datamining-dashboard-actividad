<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardCard from '../DashboardCard.vue'
import TrendBadge from '../TrendBadge.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatARS } from '@/utils/format'

const store = useDashboardStore()
const { topProductos } = storeToRefs(store)
</script>

<template>
  <DashboardCard title="Top productos" subtitle="Los más vendidos del período">
    <ol v-if="topProductos.length > 0" class="product-list">
      <li v-for="(producto, idx) in topProductos" :key="producto.nombre" class="product-row">
        <span class="rank">{{ idx + 1 }}</span>
        <div class="product-info">
          <span class="product-name">{{ producto.nombre }}</span>
          <span class="product-meta">
            <span class="product-category">{{ producto.categoria }}</span>
            <span class="product-sales">{{ formatARS(producto.ventas) }}</span>
          </span>
        </div>
        <TrendBadge :delta="producto.cambio" />
      </li>
    </ol>
    <p v-else class="empty">No hay productos en la categoría seleccionada.</p>
  </DashboardCard>
</template>

<style scoped>
.product-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.product-row {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 12px;
  align-items: center;
}

.rank {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.product-name {
  font-size: 13px;
  color: #0f172a;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.product-category::after {
  content: '·';
  margin-left: 8px;
  color: #cbd5e1;
}

.product-sales {
  color: #64748b;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.empty {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 24px 0;
}
</style>
