<template>
  <div class="admin-screen">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          <Shield class="icon-md text-white" />
        </div>
        <div>
          <h1 class="brand-title">Admin Panel</h1>
          <p class="brand-sub">ExpenseFlow</p>
        </div>
      </div>
      <nav class="menu">
        <button
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          :class="activeSection === item.id ? 'menu-active' : 'menu-inactive'"
          @click="activeSection = item.id"
        >
          <component :is="item.icon" class="icon-md" />
          <span class="menu-label">{{ item.label }}</span>
        </button>
      </nav>
    </aside>

    <main class="content">
      <header class="content-header">
        <div>
          <h1 class="title">Dashboard Administrativo</h1>
          <p class="subtitle">Bem-vindo, Administrador</p>
        </div>
        <div class="header-actions">
          <div class="searchbox">
            <Search class="search-icon" />
            <input type="text" placeholder="Buscar..." class="search-input glass-input" />
          </div>
          <button class="notify-btn glass-card">
            <Bell class="icon-md text-white" />
            <span class="notify-badge">5</span>
          </button>
          <div class="avatar">AD</div>
        </div>
      </header>

      <section class="stats-grid">
        <div v-for="(stat, i) in stats" :key="i" class="glass-card stat-card">
          <div class="stat-top">
            <div>
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value">{{ stat.value }}</p>
              <span class="stat-trend">{{ stat.trend }}</span>
            </div>
            <div class="stat-icon" :class="stat.color">
              <component :is="stat.icon" class="icon-lg text-white" />
            </div>
          </div>
        </div>
      </section>

      <section class="grid-3">
        <div class="glass-card span-2">
          <div class="section-head">
            <h2 class="section-title">Aprovações Pendentes</h2>
            <button class="link-btn">
              Ver todas
              <ChevronRight class="icon-sm" />
            </button>
          </div>
          <div class="list">
            <div v-for="item in pendingApprovals" :key="item.id" class="list-row">
              <div class="list-left">
                <div class="badge">
                  <Clock class="icon-sm" />
                </div>
                <div>
                  <p class="row-title">{{ item.user }}</p>
                  <p class="row-sub">{{ item.department }} • {{ item.type }}</p>
                </div>
              </div>
              <div class="list-right">
                <p class="row-amount">{{ item.value }}</p>
                <span class="status-pending">Pendente</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <div class="section-head">
            <h2 class="section-title">Políticas</h2>
          </div>
          <div class="list">
            <div class="list-row">
              <div class="list-left">
                <div class="badge">
                  <DollarSign class="icon-sm" />
                </div>
                <div>
                  <p class="row-title">Limite por viagem</p>
                  <p class="row-sub">R$ 1.500 por usuário</p>
                </div>
              </div>
              <div class="list-right">
                <span class="status-approved">Ativa</span>
              </div>
            </div>
            <div class="list-row">
              <div class="list-left">
                <div class="badge">
                  <Building2 class="icon-sm" />
                </div>
                <div>
                  <p class="row-title">Reembolso de hospedagem</p>
                  <p class="row-sub">Até R$ 300 por diária</p>
                </div>
              </div>
              <div class="list-right">
                <span class="status-approved">Ativa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Search,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Building2,
  BarChart3,
  Shield
} from 'lucide-vue-next'

const activeSection = ref('dashboard')

const stats = [
  { label: 'Usuários Ativos', value: '248', icon: Users, trend: '+12%', color: 'grad-blue' },
  { label: 'Despesas Pendentes', value: '67', icon: Clock, trend: '-8%', color: 'grad-amber' },
  { label: 'Total Aprovado', value: 'R$ 284.500', icon: CheckCircle2, trend: '+23%', color: 'grad-emerald' },
  { label: 'Empresas', value: '12', icon: Building2, trend: '+2', color: 'grad-purple' }
]

const pendingApprovals = [
  { id: 1, user: 'Carlos Mendes', department: 'Marketing', value: 'R$ 1.250,00', type: 'Viagem', status: 'pending' },
  { id: 2, user: 'Ana Paula', department: 'Vendas', value: 'R$ 890,00', type: 'Hospedagem', status: 'pending' },
  { id: 3, user: 'Roberto Lima', department: 'TI', value: 'R$ 2.100,00', type: 'Equipamento', status: 'pending' },
  { id: 4, user: 'Mariana Costa', department: 'RH', value: 'R$ 450,00', type: 'Alimentação', status: 'pending' }
]

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'expenses', label: 'Despesas', icon: FileText },
  { id: 'reports', label: 'Relatórios', icon: TrendingUp },
  { id: 'companies', label: 'Empresas', icon: Building2 },
  { id: 'policies', label: 'Políticas', icon: Shield },
  { id: 'settings', label: 'Configurações', icon: Settings }
]
</script>

<style scoped>
.admin-screen { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; background: radial-gradient(1000px 700px at 20% 0%, #4c1d95 0%, #312e81 45%, #0f172a 100%); }
.sidebar { display: none; background: transparent; border-right: 1px solid rgba(255,255,255,0.08); padding: 1rem; }
@media (min-width: 1024px) { .sidebar { display: block; } }
.brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding: 0 0.5rem; }
.brand-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background: linear-gradient(135deg, #2563eb, #a78bfa); display: flex; align-items: center; justify-content: center; }
.brand-title { margin: 0; font-weight: 700; color: #ffffff; }
.brand-sub { margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.6); }
.menu { display: flex; flex-direction: column; gap: 0.25rem; }
.menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.75rem; background: transparent; border: none; color: rgba(255,255,255,0.7); transition: all .2s; }
.menu-inactive:hover { background: rgba(255,255,255,0.06); color: #fff; }
.menu-active { background: rgba(37,99,235,0.2); color: #60a5fa; }
.menu-label { font-weight: 600; }

.content { padding: 1rem; }
.content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.title { margin: 0; font-size: 1.5rem; font-weight: 700; color: #fff; }
.subtitle { margin: 0; font-size: 0.875rem; color: rgba(255,255,255,0.6); }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.searchbox { position: relative; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: rgba(255,255,255,0.5); }
.search-input { padding-left: 2rem; width: 16rem; }
.notify-btn { position: relative; width: 2.75rem; height: 2.75rem; display: flex; align-items: center; justify-content: center; border-radius: 0.75rem; }
.notify-badge { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #ef4444; color: #fff; border-radius: 9999px; font-size: 12px; display: flex; align-items: center; justify-content: center; }
.avatar { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; background: linear-gradient(135deg, #2563eb, #a78bfa); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; }

.stats-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
@media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
.stat-card { padding: 1rem; }
.stat-top { display: flex; align-items: flex-start; justify-content: space-between; }
.stat-label { font-size: 0.875rem; color: rgba(255,255,255,0.7); margin: 0; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0.25rem 0 0 0; }
.stat-trend { font-size: 0.75rem; color: #10b981; }
.stat-icon { width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.grad-blue { background: linear-gradient(135deg, #3b82f6, #22d3ee); }
.grad-amber { background: linear-gradient(135deg, #f59e0b, #fb923c); }
.grad-emerald { background: linear-gradient(135deg, #10b981, #34d399); }
.grad-purple { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
.icon-lg { width: 1.5rem; height: 1.5rem; }

.grid-3 { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 1024px) { .grid-3 { grid-template-columns: 2fr 1fr; } }
.span-2 { grid-column: span 1; }
@media (min-width: 1024px) { .span-2 { grid-column: span 1; } }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.section-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; }
.link-btn { display: flex; align-items: center; gap: 0.25rem; color: #2563eb; font-size: 0.875rem; background: transparent; border: none; cursor: pointer; }
.list { display: flex; flex-direction: column; gap: 0.5rem; }
.list-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.75rem; background: rgba(255,255,255,0.08); }
.list-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.badge { width: 2rem; height: 2rem; border-radius: 0.5rem; background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; }
.row-title { margin: 0; font-weight: 600; color: #fff; }
.row-sub { margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.6); }
.list-right { text-align: right; }
.row-amount { margin: 0; font-weight: 600; color: #fff; }
</style>
