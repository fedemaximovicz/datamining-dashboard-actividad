<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import FilterBar from '@/components/FilterBar.vue'
import PosicionesFinalesCard from '@/components/cards/PosicionesFinalesCard.vue'
import PosicionPorVueltaCard from '@/components/cards/PosicionPorVueltaCard.vue'
import NeumaticosCard from '@/components/cards/NeumaticosCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { anio, meetingKey, equipo, eventos, error, cargandoDatos, datosListos, carreraNoDisputada } =
  storeToRefs(store)

const eventoLabel = computed(
  () => eventos.value.find((e) => e.meetingKey === meetingKey.value)?.label ?? null,
)

const seleccionCompleta = computed(() => Boolean(anio.value && meetingKey.value && equipo.value))
</script>

<template>
  <div class="dashboard">
    <header class="hero">
      <div>
        <p class="eyebrow">Fórmula 1 · Datos OpenF1</p>
        <h1>Dashboard de carrera</h1>
        <p v-if="eventoLabel || equipo" class="hero-meta">
          <span v-if="eventoLabel">{{ eventoLabel }}</span>
          <span v-if="eventoLabel && equipo" class="dot">·</span>
          <span v-if="equipo">{{ equipo }}</span>
        </p>
      </div>
      <span class="session-tag">Carrera</span>
    </header>

    <FilterBar />

    <p v-if="error" class="error">{{ error }}</p>

    <section v-if="carreraNoDisputada" class="placeholder notice">
      <p>Carrera aún no disputada.</p>
    </section>

    <template v-else-if="datosListos">
      <section class="grid">
        <PosicionesFinalesCard class="span-2" />
        <PosicionPorVueltaCard class="span-2" />
        <NeumaticosCard class="span-full" />
      </section>
    </template>

    <section v-else class="placeholder">
      <p v-if="cargandoDatos">Cargando datos de la carrera…</p>
      <p v-else-if="seleccionCompleta">Sin datos para esta selección.</p>
      <p v-else>Elegí año, evento y equipo para ver los datos de la carrera.</p>
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b8d98;
  font-weight: 600;
}

.hero h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

.hero-meta {
  margin: 6px 0 0;
  font-size: 13px;
  color: #c7cad3;
  font-weight: 500;
}

.hero-meta .dot {
  margin: 0 8px;
  color: #4b4b57;
}

.session-tag {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: #e10600;
  border-radius: 999px;
  padding: 6px 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #2a1416;
  border: 1px solid #5b1d1d;
  color: #fca5a5;
  font-size: 13px;
  font-weight: 500;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.span-2 {
  grid-column: span 1;
}

.span-full {
  grid-column: 1 / -1;
}

.placeholder {
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
  color: #8b8d98;
  font-size: 14px;
}

.placeholder.notice {
  border-style: solid;
  border-color: #5c4a1a;
  background: #2a230f;
  color: #fbbf24;
  font-weight: 600;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: 1 / -1;
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
}
</style>
