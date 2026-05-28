<script setup lang="ts">
// Shell del dashboard de F1. La cabecera, los filtros y los componentes de la
// sesión de carrera se agregan en las fases siguientes.
</script>

<template>
  <div class="dashboard">
    <header class="hero">
      <p class="eyebrow">Fórmula 1 · Datos OpenF1</p>
      <h1>Dashboard de carrera</h1>
    </header>

    <section class="placeholder">
      <p>Próximamente: filtros y componentes de la sesión de carrera.</p>
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
}
</style>
