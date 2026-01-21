<template>
  <div class="min-h-screen pb-24 text-white">
    <header class="glass-header">
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white" @click="goHome">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="text-xl font-bold text-white">Configurações</h1>
      <div class="w-10"></div>
    </header>

    <main class="pt-24 px-4 max-w-lg mx-auto space-y-6">
      <!-- Parâmetros Operacionais -->
      <section class="glass-card p-0 overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5">
          <h2 class="font-bold text-white">Parâmetros Operacionais</h2>
        </div>
        <div class="divide-y divide-white/10">
          <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <i class="fas fa-credit-card"></i>
              </div>
              <div>
                <div class="font-medium text-white">Cartões Corporativos</div>
                <div class="text-xs text-white-50">Gerenciar cartões e portadores</div>
              </div>
            </div>
            <i class="fas fa-chevron-right text-white-40 group-hover:text-white transition-colors"></i>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                <i class="fas fa-tags"></i>
              </div>
              <div>
                <div class="font-medium text-white">Tipos de Despesas</div>
                <div class="text-xs text-white-50">Categorias para classificação</div>
              </div>
            </div>
            <i class="fas fa-chevron-right text-white-40 group-hover:text-white transition-colors"></i>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <i class="fas fa-briefcase"></i>
              </div>
              <div>
                <div class="font-medium text-white">Projetos</div>
                <div class="text-xs text-white-50">Gerenciar projetos e contas</div>
              </div>
            </div>
            <i class="fas fa-chevron-right text-white-40 group-hover:text-white transition-colors"></i>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <i class="fas fa-users"></i>
              </div>
              <div>
                <div class="font-medium text-white">Usuários</div>
                <div class="text-xs text-white-50">Gerenciar autorizadores e beneficiários</div>
              </div>
            </div>
            <i class="fas fa-chevron-right text-white-40 group-hover:text-white transition-colors"></i>
          </div>
        </div>
      </section>

      <!-- Usuários Cadastrados -->
      <section class="glass-card p-0 overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5">
          <h2 class="font-bold text-white">Usuários cadastrados</h2>
        </div>
        
        <div v-if="loadingUsers" class="p-8 text-center text-white-50">Carregando usuários...</div>
        <div v-else-if="users.length === 0" class="p-8 text-center text-white-50">
          Nenhum usuário encontrado.
        </div>
        <div v-else class="divide-y divide-white/10">
          <div
            v-for="user in users"
            :key="user.id_beneficiario"
            class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/10">
                {{ initials(user.nome) }}
              </div>
              <div>
                <div class="font-medium text-white">{{ user.nome }}</div>
                <div class="text-xs text-white-50">{{ user.email }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium border"
                :class="user.role === 'ADMIN' ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-white-60 border-white/10'"
              >
                {{ user.role === 'ADMIN' ? 'Admin' : 'Usuário' }}
              </span>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white-60 hover:text-white transition-colors" @click="viewExpenses(user)" title="Ver Despesas">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Preferências -->
      <section class="glass-card p-0 overflow-hidden">
        <div class="p-4 border-b border-white/10 bg-white/5">
          <h2 class="font-bold text-white">Preferências do Aplicativo</h2>
        </div>
        <div class="divide-y divide-white/10">
          <div class="p-4 flex items-center justify-between">
            <div>
              <div class="font-medium text-white">Notificações</div>
              <div class="text-xs text-white-50">Alertas de novas despesas e faturas</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notifications" class="sr-only peer">
              <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div class="p-4 flex items-center justify-between">
            <div>
              <div class="font-medium text-white">Modo escuro</div>
              <div class="text-xs text-white-50">Tema escuro do aplicativo</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="darkMode" class="sr-only peer">
              <div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Despesas -->
    <div v-if="showExpensesModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" @click.self="closeModal">
      <div class="glass-card w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden p-0 animate-fade-in-up">
        <header class="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
          <h3 class="text-lg font-bold text-white">Despesas de {{ selectedUser?.nome }}</h3>
          <button class="text-white/60 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div class="p-4 overflow-y-auto custom-scrollbar flex-1 bg-black/10">
          <div v-if="loadingExpenses" class="py-8 text-center text-white-50">Carregando despesas...</div>
          <div v-else-if="userExpenses.length === 0" class="py-8 text-center text-white-50">
            Nenhuma despesa encontrada para este usuário.
          </div>
          <ul v-else class="space-y-3">
            <li v-for="expense in userExpenses" :key="expense.id_despesa" class="glass-card p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div class="flex flex-col">
                <div class="text-sm font-medium text-white">
                  {{ expense.descricao || expense.cnpj_fornecedor || 'Despesa sem descrição' }}
                </div>
                <div class="text-xs text-white-50">{{ formatDate(expense.data_despesa) }}</div>
              </div>
              <div class="text-sm font-bold text-primary">
                R$ {{ formatCurrency(expense.valor) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id_beneficiario: number
  nome: string
  login: string
  email: string
  role: string
}

interface Expense {
  id_despesa: number
  valor: number
  data_despesa: string
  cnpj_fornecedor?: string
  descricao?: string
  tipoDespesa?: { descricao: string }
}

const router = useRouter()
const users = ref<User[]>([])
const loadingUsers = ref(true)
const notifications = ref(true)
const darkMode = ref(false)

// Modal State
const showExpensesModal = ref(false)
const selectedUser = ref<User | null>(null)
const userExpenses = ref<Expense[]>([])
const loadingExpenses = ref(false)

// Watcher para Dark Mode (Mantido para compatibilidade, mas o CSS moderno já lida com cores)
watch(darkMode, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-mode')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'false')
  }
})

function goHome() {
  router.push('/home')
}

function initials(name: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

async function fetchUsers() {
  try {
    loadingUsers.value = true
    const token = localStorage.getItem('token')
    const headers: any = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const resp = await fetch('http://localhost:5175/api/admin/users', { headers })
    if (resp.status === 401 || resp.status === 403) {
      router.push('/login')
      return
    }
    if (!resp.ok) throw new Error('Erro ao carregar usuários')
    const data = await resp.json()
    users.value = data
  } catch (e) {
    users.value = []
  } finally {
    loadingUsers.value = false
  }
}

async function viewExpenses(user: User) {
  selectedUser.value = user
  showExpensesModal.value = true
  loadingExpenses.value = true
  userExpenses.value = []
  
  try {
    const token = localStorage.getItem('token')
    const headers: any = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const resp = await fetch(`http://localhost:5175/api/admin/users/${user.id_beneficiario}/expenses`, { headers })
    
    if (!resp.ok) throw new Error('Erro ao carregar despesas')
    const data = await resp.json()
    userExpenses.value = data.map((d: any) => ({
      ...d,
      descricao: d.tipoDespesa?.descricao || d.cnpj_fornecedor
    }))
  } catch (e) {
    console.error(e)
  } finally {
    loadingExpenses.value = false
  }
}

function closeModal() {
  showExpensesModal.value = false
  selectedUser.value = null
}

onMounted(() => {
  fetchUsers()
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    darkMode.value = true
  }
})
</script>

<style scoped>
/* Estilos específicos mínimos, o resto vem do modern-design.css */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
