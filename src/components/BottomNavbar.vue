<template>
  <nav class="bottom-navbar" :class="variant">
    <router-link to="/home" class="nav-item" active-class="active">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </router-link>
    <router-link to="/fatura" class="nav-item" active-class="active">
      <i class="fas fa-file-invoice"></i>
      <span>Fatura</span>
    </router-link>
    <router-link to="/ocr" class="nav-item" active-class="active">
      <i class="fas fa-camera"></i>
      <span>Despesa</span>
    </router-link>
    <router-link
      v-if="isAdmin"
      to="/configuracao"
      class="nav-item"
      active-class="active"
    >
      <i class="fas fa-cog"></i>
      <span>Config</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'light' | 'modern'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light'
})

function getRoleFromToken(): string | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const payload = JSON.parse(json)
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

const isAdmin = computed(() => getRoleFromToken() === 'ADMIN')
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

/* Light Variant (Default) */
.bottom-navbar.light {
  background-color: #ffffff;
  border-top: 1px solid #ddd;
}

.bottom-navbar.light .nav-item {
  color: #6c757d;
}

.bottom-navbar.light .nav-item.active {
  color: #007bff;
}

/* Modern Variant (Dark Glass) */
.bottom-navbar.modern {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: env(safe-area-inset-bottom, 20px); /* Adjust for mobile home bar */
}

.bottom-navbar.modern .nav-item {
  color: rgba(255, 255, 255, 0.5);
}

.bottom-navbar.modern .nav-item.active {
  color: #a78bfa; /* accent color from modern theme */
  text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.2s;
  flex: 1;
}

.nav-item i {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}
</style>
