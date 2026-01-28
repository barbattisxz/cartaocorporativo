<template>
  <div class="p-6">
    <PageHeader 
      title="Detalhes da Fatura" 
      :breadcrumbs="[{ label: 'Dashboard', path: '/' }, { label: 'Fatura' }]"
    />

    <div v-if="loading" class="text-center py-8 text-muted-foreground">
      Carregando...
    </div>
    <div v-else-if="error" class="text-center py-8 text-destructive">
      {{ error }}
    </div>
    <div v-else class="grid gap-6">
      <!-- Invoice Summary Card -->
      <div class="stats-card flex items-center p-6 bg-card rounded-lg border border-border shadow-sm">
        <div class="stats-icon stats-icon-primary mr-4">
          <FileText class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <p class="text-2xl font-bold text-foreground">{{ formatCurrency(invoiceData.amount) }}</p>
          <p class="text-sm text-muted-foreground">{{ invoiceData.date }}</p>
        </div>
        <div class="text-success font-medium px-3 py-1 bg-success/10 rounded-full text-sm">Aprovada</div>
      </div>

      <!-- Items Table -->
      <div class="vuexy-card bg-card rounded-lg border border-border shadow-sm">
        <div class="vuexy-card-header p-6 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Itens da Fatura</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th class="px-6 py-3 font-medium">Descrição</th>
                <th class="px-6 py-3 font-medium">Data</th>
                <th class="px-6 py-3 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="invoiceData.items.length === 0">
                <td colspan="3" class="text-center py-8 text-muted-foreground">Nenhum item encontrado.</td>
              </tr>
              <tr v-else v-for="(item, index) in invoiceData.items" :key="index" class="border-b border-border hover:bg-muted/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                      <ShoppingBag class="w-4 h-4" />
                    </div>
                    <span class="font-medium text-foreground">{{ item.descricao }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-muted-foreground">
                  {{ item.data_item ? formatDate(item.data_item) : '-' }}
                </td>
                <td class="px-6 py-4 font-semibold text-foreground">
                  {{ formatCurrency(item.valor) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileText, ShoppingBag } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const invoiceData = ref<any>(null)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

async function fetchInvoiceDetails() {
  const id = route.params.id
  if (!id) {
    error.value = 'ID da fatura não fornecido.'
    loading.value = false
    return
  }

  try {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`http://localhost:5175/api/fatura/${id}`, { headers })
    
    if (response.status === 401 || response.status === 403) {
      router.push('/login')
      return
    }

    if (!response.ok) throw new Error('Erro ao buscar detalhes da fatura')
    
    const data = await response.json()
    
    // Map backend response to frontend structure
    invoiceData.value = {
      amount: data.extractedData?.valorTotal || 0,
      date: data.extractedData?.data ? new Date(data.extractedData.data).toLocaleDateString('pt-BR') : new Date(data.createdAt).toLocaleDateString('pt-BR'),
      items: data.extractedData?.itens || []
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar dados da fatura.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInvoiceDetails()
})
</script>
