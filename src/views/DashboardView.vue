<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import FilterBar from '@/components/FilterBar.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const { anio, meetingKey, equipo, eventos } = storeToRefs(store)

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

    <section class="placeholder">
      <p v-if="seleccionCompleta">
        Selección lista. Los componentes de la carrera se agregan en la fase 5.
      </p>
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

.hero-meta {
  margin: 6px 0 0;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.hero-meta .dot {
  margin: 0 8px;
  color: #cbd5e1;
}

.session-tag {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #b91c1c;
  background: #fee2e2;
  border-radius: 999px;
  padding: 6px 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.placeholder {
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
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
