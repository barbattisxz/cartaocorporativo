<template>
  <div class="min-h-screen px-4 pb-24 pt-6 w-full modern-home">
    <!-- Header -->
    <header class="mb-6 flex items-center justify-between">
      <div>
        <p class="text-sm text-white-60">Bem-vindo de volta,</p>
        <h1 class="text-2xl font-bold text-white">João</h1>
      </div>
      <div class="glass-card flex h-12 w-12 items-center justify-center rounded-full p-0">
        <span class="text-lg font-semibold text-white">JS</span>
      </div>
    </header>

    <!-- Main Balance Card -->
    <div class="glass-card-strong mb-6 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />
      <div class="relative">
        <p class="mb-1 text-sm text-white-60">Total de Despesas (Mês)</p>
        <h2 class="gradient-text text-4xl font-bold">{{ formattedTotal }}</h2>
        <p class="mt-2 text-sm text-white-60">
          {{ expenses.length }} despesas registradas
        </p>
        <div class="mt-4 h-2 overflow-hidden rounded-full bg-white-10">
          <div class="h-full w-[70%] rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="mb-6 grid grid-cols-2 gap-3">
      <!-- Despesas Card -->
      <div class="glass-card">
        <div class="mb-2 flex items-center justify-between">
          <i class="fas fa-credit-card h-5 w-5 text-primary"></i>
          <span class="flex items-center text-xs text-success">
            <i class="fas fa-arrow-trend-up mr-1"></i>
            12%
          </span>
        </div>
        <p class="text-2xl font-bold text-white">{{ formattedTotal }}</p>
        <p class="text-xs text-white-60">Gasto Total</p>
      </div>

      <!-- Pendentes Card (Mock/Placeholder or Count if available) -->
      <div class="glass-card">
        <div class="mb-2 flex items-center justify-between">
          <i class="fas fa-clock h-5 w-5 text-warning"></i>
        </div>
        <p class="text-2xl font-bold text-white">5</p>
        <p class="text-xs text-white-60">Pendentes</p>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="glass-card">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold text-white">Últimas Despesas</h3>
        <button class="flex items-center text-sm text-primary">
          Ver todas
          <i class="fas fa-arrow-up-right-from-square ml-1"></i>
        </button>
      </div>
      
      <div v-if="loading" class="text-center p-4 text-white-60">
        Carregando...
      </div>
      <div v-else-if="expenses.length === 0" class="text-center p-4 text-white-50">
        Nenhuma despesa registrada.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(expense, index) in expenses.slice(0, 5)"
          :key="expense.id || index"
          class="flex items-center gap-3 rounded-xl bg-white-5 p-3 transition-all hover:bg-white-10 cursor-pointer"
          @click="goToDetails(expense)"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white-10">
            <i class="fas fa-bag-shopping h-5 w-5 text-primary"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-white">{{ expense.description }}</p>
            <p class="text-xs text-white-50">{{ expense.category }} • {{ expense.date }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-white">{{ formatCurrency(expense.amount) }}</p>
            <span class="inline-block rounded-full px-2 py-0.5 text-xs status-approved">
              Aprovada
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <BottomNavbar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavbar from '../components/BottomNavbar.vue'

const router = useRouter()
const expenses = ref<any[]>([])
const loading = ref(true)

const totalAmount = computed(() => {
  return expenses.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const formattedTotal = computed(() => {
  return formatCurrency(totalAmount.value)
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

async function fetchExpenses() {
  try {
    const token = localStorage.getItem('token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:5175/api/expenses', {
      headers
    })
    
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login';
      return;
    }

    if (!response.ok) throw new Error('Erro ao buscar despesas')
    
    const data = await response.json()
    
    expenses.value = data.map((item: any) => {
      const isLegacy = !!item.extractedData;
      const source = isLegacy ? item.extractedData : item;
      const itemsList = isLegacy ? source.itens : source.items;
      const firstItem = itemsList && itemsList.length > 0 ? itemsList[0] : {}
      
      return {
        id: item.id,
        date: source.data || new Date(item.createdAt).toLocaleDateString('pt-BR'),
        description: source.estabelecimento || firstItem.descricao || 'Despesa sem descrição',
        category: source.tipoGasto || source.categoria || firstItem.categoria || 'Outros',
        projectCode: `ID-${item.id.toString()}`, 
        amount: source.valorTotal || firstItem.valor || 0,
        hasInvoice: true
      }
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchExpenses()
})

function goToDetails(expense: any) {
  const c = String(expense.category || '').toLowerCase()
  if (c.includes('fatura') && typeof expense.id === 'number') {
    router.push(`/fatura/${expense.id}`)
  }
}
</script>

<style scoped>
/* Scoped overrides if necessary, but mostly using global modern-design.css classes */
.modern-home {
  /* Ensure padding for fixed header if we used one, but here we use normal flow with mb-6 */
  padding-top: 1.5rem; 
}
</style>
