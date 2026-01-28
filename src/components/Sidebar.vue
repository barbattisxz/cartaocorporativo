<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-lg">D</span>
        </div>
        <div>
          <h1 class="text-foreground font-semibold text-lg">Despesas</h1>
          <p class="text-muted-foreground text-xs">Gestão Corporativa</p>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="sidebar-menu">
      <div class="px-4 mb-4">
        <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </span>
      </div>

      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-item relative"
        :class="{ 'sidebar-item-active': isActive(item.path) }"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-sidebar-border">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-foreground truncate">{{ userName }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ userEmail }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Plus,
  FileText,
  Clock,
  CreditCard,
  User
} from 'lucide-vue-next'

const route = useRoute()
const currentUser = ref<any>(null)

defineProps<{
  isOpen?: boolean
}>()

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/home" },
  { icon: Plus, label: "Nova Despesa", path: "/nova-despesa" },
  { icon: FileText, label: "Faturas", path: "/fatura" },
  { icon: Clock, label: "Histórico", path: "/despesas" },
  { icon: CreditCard, label: "Cartões", path: "/cartoes" },
  { icon: User, label: "Perfil", path: "/perfil" },
]

function isActive(path: string) {
  if (path === '/home' && (route.path === '/home' || route.path === '/')) return true
  if (path !== '/home' && route.path.startsWith(path)) return true
  return false
}

onMounted(() => {
  const u = localStorage.getItem('user')
  if (u) {
    try { currentUser.value = JSON.parse(u) } catch {}
  }
})

const userName = computed(() => currentUser.value?.nome || 'Usuário')
const userEmail = computed(() => currentUser.value?.email || 'usuario@exemplo.com')
const userInitials = computed(() => {
  const name = userName.value
  return name.substring(0, 2).toUpperCase()
})
</script>
