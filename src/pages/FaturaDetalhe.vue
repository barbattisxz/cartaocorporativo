<template>
  <div class="detalhe-screen">
    <header class="detalhe-header">
      <button class="back-btn" @click="goHome" aria-label="Voltar">←</button>
      <h1 class="header-title">Detalhes da Fatura</h1>
    </header>
    <main class="detalhe-main">
      <div v-if="loading" class="text-center p-4">Carregando...</div>
      <div v-else-if="!dados" class="text-center p-4 text-muted">Fatura não encontrada.</div>
      <div v-else class="detalhe-card">
        <div class="top">
          <div class="left">
            <div class="date">{{ formatDate(dados.data) }}</div>
            <div class="estab">{{ dados.estabelecimento }}</div>
            <div class="meta">
              <span class="label">Cartão</span>
              <span class="value">•••• {{ last4(dados.numeroCartao) }}</span>
            </div>
          </div>
          <div class="right">
            <div class="amount">{{ formatCurrency(dados.valorTotal) }}</div>
            <div class="badge">Com nota</div>
          </div>
        </div>
        <div class="items">
          <div class="items-title">Itens</div>
          <div class="item" v-for="(it, idx) in dados.itens" :key="idx">
            <div class="item-left">
              <div class="desc">{{ it.descricao }}</div>
              <div class="cat">{{ it.categoria || 'Item' }}</div>
            </div>
            <div class="item-right">{{ formatCurrency(it.valor || 0) }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const dados = ref<any>(null)

function formatCurrency(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)
}
function formatDate(d: string | Date) {
  const dt = typeof d === 'string' ? new Date(d) : d
  return dt.toLocaleDateString('pt-BR')
}
function last4(num: string | null) {
  if (!num) return '0000'
  const clean = String(num).replace(/\s+/g, '')
  return clean.slice(-4).padStart(4, '0')
}

async function fetchDetalhe() {
  try {
    const id = route.params.id
    const token = localStorage.getItem('token');
    const headers: any = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const resp = await fetch(`http://localhost:5175/api/faturas/${id}`, { headers })
    if (resp.status === 401 || resp.status === 403) {
      window.location.href = '/login'
      return
    }
    if (!resp.ok) throw new Error('Erro ao carregar detalhes')
    dados.value = await resp.json()
  } catch (e) {
    dados.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetalhe)

function goHome() {
  router.push('/home')
}
</script>

<style scoped>
/* Scoped styles removed in favor of modern-design.css classes */
</style>
