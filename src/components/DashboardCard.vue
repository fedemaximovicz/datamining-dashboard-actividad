<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="card">
    <header class="card-header">
      <div class="title-block">
        <div class="title-row">
          <slot name="title-icon" />
          <h2 class="title">{{ title }}</h2>
        </div>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="actions"><slot name="actions" /></div>
    </header>
    <div class="content"><slot /></div>
  </section>
</template>

<style scoped>
.card {
  background: #1f1f27;
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  color: #8b8d98;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0;
}
</style>
