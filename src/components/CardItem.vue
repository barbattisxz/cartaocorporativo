<template>
  <div class="card-item">
    <div class="card-left">
      <div class="brand">{{ cardType }}</div>
      <div class="number">•••• {{ cardNumber }}</div>
    </div>
    <div class="card-right">
      <div class="holder">{{ cardHolder }}</div>
      <div class="status" :class="statusClass">{{ status }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  cardType: string
  cardNumber: string
  cardHolder: string
  status: string
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  return props.status?.toLowerCase() === 'ativo' ? 'status-active' : 'status-inactive'
})
</script>

<style scoped>
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
}

.card-left { display: flex; flex-direction: column; }
.brand { font-weight: 600; color: #ffffff; }
.number { font-size: 12px; color: rgba(255,255,255,0.6); }

.card-right { text-align: right; }
.holder { font-size: 12px; color: rgba(255,255,255,0.7); }
.status { font-size: 12px; font-weight: 600; }
.status-active { color: #16a34a; }
.status-inactive { color: #ef4444; }
</style>
