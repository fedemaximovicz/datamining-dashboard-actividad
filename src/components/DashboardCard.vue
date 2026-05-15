<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="card">
    <header class="card-header">
      <div class="title-row">
        <slot name="title-icon" />
        <h2 class="title">{{ title }}</h2>
      </div>
      <div class="actions"><slot name="actions" /></div>
    </header>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    <div class="content"><slot /></div>
  </section>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.subtitle {
  margin: 0 0 14px;
  font-size: 13px;
  color: #94a3b8;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content {
  flex: 1;
  min-width: 0;
}
</style>
