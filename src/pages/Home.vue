<template>
  <div class="p-6">
    <PageHeader 
      title="Dashboard" 
      :subtitle="`Bem-vindo de volta, ${firstName}`"
      :breadcrumbs="[{ label: 'Dashboard' }]"
    />

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard 
        :icon="Wallet" 
        :value="formattedTotal" 
        label="Despesas do Mês"
        variant="primary"
        :trend="{ value: '12%', positive: false }" 
        :delay="1"
      />
      <StatsCard 
        :icon="CheckCircle" 
        :value="String(approvedCount)" 
        label="Cadastrados"
        variant="success"
        :delay="2"
      />
      <StatsCard 
        :icon="Clock" 
        :value="String(pendingCount)" 
        label="Pendentes"
        variant="warning"
        :delay="3"
      />
      <StatsCard 
        :icon="TrendingUp" 
        value="R$ 1.250,00" 
        label="Limite Disponível"
        variant="info"
        :delay="4"
      />
    </div>

    <!-- Recent Expenses Table -->
    <div class="vuexy-card animate-fade-in animate-fade-in-delay-4">
      <div class="vuexy-card-header flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 class="text-lg font-semibold text-foreground">Despesas Recentes</h2>
          <p class="text-sm text-muted-foreground">Últimas transações registradas</p>
        </div>
        <RouterLink to="/despesas" class="btn-outline text-sm py-2 px-4 inline-flex items-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors">
          Ver todas
          <ArrowUpRight class="w-4 h-4 ml-2" />
        </RouterLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th class="px-6 py-3 font-medium">Descrição</th>
              <th class="px-6 py-3 font-medium">Tipo</th>
              <th class="px-6 py-3 font-medium">Data</th>
              <th class="px-6 py-3 font-medium">Valor</th>
              <th class="px-6 py-3 font-medium">Status</th>
              <th class="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8 text-muted-foreground">Carregando...</td>
            </tr>
            <tr v-else-if="latestExpenses.length === 0">
              <td colspan="6" class="text-center py-8 text-muted-foreground">Nenhuma despesa registrada.</td>
            </tr>
            <tr v-else v-for="(tx, index) in latestExpenses" :key="index" class="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" @click="handleItemClick(tx)">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                    <component :is="getCategoryIcon(tx.category)" class="w-5 h-5" />
                  </div>
                  <span class="font-medium text-foreground">{{ tx.description }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-muted-foreground">{{ tx.category }}</td>
              <td class="px-6 py-4 text-muted-foreground">{{ tx.date }}</td>
              <td class="px-6 py-4 font-semibold text-foreground">{{ formatCurrency(tx.amount) }}</td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="tx.hasInvoice ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
                >
                  {{ tx.hasInvoice ? 'Aprovada' : 'Pendente' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="handleItemClick(tx)" class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Wallet,
  ShoppingBag,
  Coffee,
  Car,
  FileText,
  MoreVertical
} from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'
import StatsCard from '../components/cards/StatsCard.vue'

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
const currentUser = ref<any>(null)
const router = useRouter()

function handleItemClick(tx: Expense) {
  const isFatura = 
    tx.category.toLowerCase().includes('fatura') || 
    tx.description.toLowerCase().includes('fatura') ||
    (tx.amount > 0 && tx.hasInvoice); // Assume fatura se tiver invoice e valor (tentativa)

  if (isFatura) {
    const idStr = tx.projectCode.replace('ID-', '')
    // Se for 'Despesa' mas queremos ver detalhes, talvez tenhamos que ajustar a rota ou o backend.
    // Mas por enquanto, vamos assumir que se o usuário clicou, ele quer ver detalhes.
    // O problema é se o ID for de uma Despesa e passarmos para a rota de Fatura, o backend não vai achar.
    
    // Vamos verificar se é explicitamente uma Fatura pelo backend
    if (tx.category.toLowerCase() === 'fatura' || tx.description === 'Fatura Cartão') {
        router.push(`/fatura-detalhes/${idStr}`)
    } else {
        // Se for uma Despesa comum, avisa o usuário
        alert('Este item é uma Despesa Avulsa e não possui detalhamento de fatura. Se deveria ser uma fatura, por favor envie o arquivo novamente.')
    }
  }
}

const totalAmount = computed(() => {
  return expenses.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const formattedTotal = computed(() => {
  return formatCurrency(totalAmount.value)
})

const approvedCount = computed(() => expenses.value.length)
const pendingCount = computed(() => 0)
const displayName = computed(() => {
  const u = currentUser.value || {}
  return u.nome || u.name || u.login || 'Usuário'
})
const firstName = computed(() => {
  const name: string = displayName.value || ''
  return name.trim().split(/\s+/)[0] || name
})

const latestExpenses = computed(() => expenses.value.slice(0, 5))

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
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch('http://localhost:5175/api/expenses', {
      headers
    })

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
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const u = localStorage.getItem('user')
  if (u) {
    try { currentUser.value = JSON.parse(u) } catch {}
  }
  fetchExpenses()
})
</script>
