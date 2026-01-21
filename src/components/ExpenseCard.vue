<template>
  <div class="expense-card">
    <div class="expense-top">
      <div class="expense-left">
        <div class="expense-date">{{ date }}</div>
        <div class="expense-desc">{{ description }}</div>
        <div class="expense-meta">
          <span class="expense-category">{{ category }}</span>
          <span class="expense-project">{{ projectCode }}</span>
        </div>
      </div>
      <div class="expense-right">
        <div class="expense-amount">{{ formattedAmount }}</div>
        <div class="expense-invoice" :class="invoiceClass">
          {{ hasInvoice ? 'Com nota' : 'Sem nota' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  date: string
  description: string
  category: string
  projectCode: string
  amount: number
  hasInvoice: boolean
}

const props = defineProps<Props>()

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.amount)
})

const invoiceClass = computed(() => (props.hasInvoice ? 'invoice-ok' : 'invoice-missing'))
</script>

<style scoped>
.expense-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.expense-top { display: flex; justify-content: space-between; gap: 12px; }
.expense-left { display: flex; flex-direction: column; gap: 4px; }
.expense-right { text-align: right; }

.expense-date { font-size: 12px; color: #6b7280; }
.expense-desc { font-size: 14px; font-weight: 600; color: #1f2937; }

.expense-meta { display: flex; gap: 8px; font-size: 12px; color: #374151; }
.expense-category { font-weight: 500; }
.expense-project { opacity: 0.8; }

.expense-amount { font-weight: 700; color: #111827; }
.expense-invoice { font-size: 12px; margin-top: 4px; }
.invoice-ok { color: #16a34a; }
.invoice-missing { color: #ef4444; }
</style>