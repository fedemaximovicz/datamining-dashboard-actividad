<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import FilterBar from '@/components/FilterBar.vue'
import KpiTile from '@/components/KpiTile.vue'
import VentasEnElTiempoCard from '@/components/cards/VentasEnElTiempoCard.vue'
import VentasPorCategoriaCard from '@/components/cards/VentasPorCategoriaCard.vue'
import TopProductosCard from '@/components/cards/TopProductosCard.vue'
import VentasPorSucursalCard from '@/components/cards/VentasPorSucursalCard.vue'
import ComposicionClientesCard from '@/components/cards/ComposicionClientesCard.vue'
import {
  ETIQUETAS_COMPARACION,
  useDashboardStore,
} from '@/stores/dashboard'
import { formatARS, formatNumber, formatPercent } from '@/utils/format'

const store = useDashboardStore()
const {
  ventasTotales,
  ticketPromedio,
  transacciones,
  margenBruto,
  compararCon,
  rangoActual,
} = storeToRefs(store)

const comparacionLabel = computed(() => ETIQUETAS_COMPARACION[compararCon.value])

const rangoLabel = computed(() => {
  const { desde, hasta } = rangoActual.value
  return desde === hasta ? desde : `${desde} → ${hasta}`
})
</script>

<template>
  <div class="dashboard">
    <header class="hero">
      <div>
        <p class="eyebrow">Cadena de Supermercados · Misiones</p>
        <h1>Dashboard de ventas</h1>
      </div>
      <span class="range-tag">{{ rangoLabel }}</span>
    </header>

    <FilterBar />

    <section class="kpi-grid">
      <KpiTile
        label="Ventas totales"
        :valor="formatARS(ventasTotales.valor)"
        :delta="ventasTotales.delta"
        :comparacion-label="comparacionLabel"
      />
      <KpiTile
        label="Ticket promedio"
        :valor="formatARS(ticketPromedio.valor)"
        :delta="ticketPromedio.delta"
        :comparacion-label="comparacionLabel"
      />
      <KpiTile
        label="Transacciones"
        :valor="formatNumber(transacciones.valor)"
        :delta="transacciones.delta"
        :comparacion-label="comparacionLabel"
      />
      <KpiTile
        label="Margen bruto"
        :valor="formatPercent(margenBruto.valor)"
        :delta="margenBruto.delta"
        unidad-delta="pp"
        :comparacion-label="comparacionLabel"
      />
    </section>

    <section class="trend-grid">
      <VentasEnElTiempoCard class="trend-main" />
      <VentasPorCategoriaCard class="trend-side" />
    </section>

    <section class="detail-grid">
      <TopProductosCard />
      <VentasPorSucursalCard />
      <ComposicionClientesCard />
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 32px 56px;
}

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  font-weight: 600;
}

.hero h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.range-tag {
  font-size: 12px;
  color: #64748b;
  background: #ffffff;
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  font-variant-numeric: tabular-nums;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.trend-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .trend-grid {
    grid-template-columns: 1fr;
  }
  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .dashboard {
    padding: 20px 16px 40px;
  }
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .kpi-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
