<template>
  <div class="p-6">
    <PageHeader 
      title="Histórico de Despesas"
      subtitle="Visualize todas as suas despesas registradas"
      :breadcrumbs="[{ label: 'Histórico' }]"
    />

    <div class="vuexy-card animate-fade-in">
      <!-- Filters -->
      <div class="p-6 border-b border-border">
        <div class="flex flex-col sm:flex-row gap-4 justify-between">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar despesas..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              v-model="searchQuery"
            />
          </div>
          <div class="flex gap-2">
            <button class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2">
              <Filter class="w-4 h-4 mr-2" />
              Filtros
            </button>
            <button class="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2">
              <Download class="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Descrição</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Tipo</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Data</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Valor</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Status</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="p-4 text-center">Carregando...</td>
            </tr>
            <tr v-else-if="expenses.length === 0">
              <td colspan="6" class="p-4 text-center">Nenhuma despesa encontrada.</td>
            </tr>
            <tr 
              v-for="(expense, index) in filteredExpenses" 
              :key="index"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted animate-fade-in cursor-pointer"
              :style="{ animationDelay: `${Math.min(index + 1, 4) * 100}ms` }"
              @click="handleItemClick(expense)"
            >
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <component :is="getCategoryIcon(expense.category)" class="w-5 h-5" />
                  </div>
                  <span class="font-medium text-foreground">{{ expense.description }}</span>
                </div>
              </td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">{{ expense.category }}</td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                {{ expense.date }}
              </td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-semibold text-foreground">{{ formatCurrency(expense.amount) }}</td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <span 
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  :class="expense.hasInvoice ? 'border-transparent bg-success/10 text-success hover:bg-success/20' : 'border-transparent bg-warning/10 text-warning hover:bg-warning/20'"
                >
                  {{ expense.hasInvoice ? 'Aprovada' : 'Pendente' }}
                </span>
              </td>
              <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical class="w-4 h-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-border flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Mostrando {{ filteredExpenses.length }} resultados
        </p>
        <div class="flex gap-2">
          <button class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2" disabled>
            Anterior
          </button>
          <button class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2" disabled>
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, MoreVertical, Search, Filter, Download, ShoppingBag, Coffee, Car } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'

interface Expense {
  date: string
  description: string
  category: string
  projectCode: string
  amount: number
  hasInvoice: boolean
}

const expenses = ref<Expense[]>([])
const loading = ref(true)
const searchQuery = ref('')
const router = useRouter()

const filteredExpenses = computed(() => {
  if (!searchQuery.value) return expenses.value
  const query = searchQuery.value.toLowerCase()
  return expenses.value.filter(e => 
    e.description.toLowerCase().includes(query) || 
    e.category.toLowerCase().includes(query)
  )
})

function handleItemClick(tx: Expense) {
  const isFatura = 
    tx.category.toLowerCase().includes('fatura') || 
    tx.description.toLowerCase().includes('fatura');

  if (isFatura) {
    const idStr = tx.projectCode.replace('ID-', '')
    router.push(`/fatura-detalhes/${idStr}`)
  } else {
    // Feedback visual para o usuário
    alert('Detalhes disponíveis apenas para Faturas de Cartão.')
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function getCategoryIcon(category: string) {
  const lower = category.toLowerCase()
  if (lower.includes('transporte') || lower.includes('uber') || lower.includes('combust')) return Car
  if (lower.includes('aliment') || lower.includes('restaurante') || lower.includes('almo')) return Coffee
  if (lower.includes('compra') || lower.includes('suprimento') || lower.includes('material')) return ShoppingBag
  return FileText
}

async function fetchExpenses() {
  try {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch('http://localhost:5175/api/expenses', { headers })
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'
      return
    }
    if (!response.ok) throw new Error('Erro ao buscar despesas')
    const data = await response.json()

    expenses.value = data.map((item: any) => {
      const isLegacy = !!item.extractedData
      const source = isLegacy ? item.extractedData : item
      const itemsList = isLegacy ? source.itens : source.items
      const firstItem = itemsList && itemsList.length > 0 ? itemsList[0] : {}
      return {
        date: source.data || new Date(item.createdAt).toLocaleDateString('pt-BR'),
        description: source.estabelecimento || firstItem.descricao || 'Despesa sem descrição',
        category: source.tipoGasto || source.categoria || firstItem.categoria || 'Outros',
        projectCode: `ID-${item.id.toString()}`,
        amount: source.valorTotal || firstItem.valor || 0,
        hasInvoice: true
      }
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchExpenses)
</script>