<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNavbar from './components/BottomNavbar.vue'
import GlobalStyles from './components/GlobalStyles.vue'

const route = useRoute()
const showBottomNavbar = computed(() => route.name !== 'login' && route.name !== 'ocr' && route.name !== 'register')
const isModernRoute = computed(() => ['home', 'fatura', 'ocr', 'configuracao', 'carteira'].includes(route.name as string))

// Gerencia a classe no body para o tema moderno
import { watch } from 'vue'
watch(isModernRoute, (newValue) => {
  if (newValue) {
    document.body.classList.add('modern-theme')
  } else {
    document.body.classList.remove('modern-theme')
  }
}, { immediate: true })
</script>

<template>
  <div class="vuexy-app" :class="{ 'has-bottom-navbar': showBottomNavbar, 'modern-layout': isModernRoute }">
    <GlobalStyles />
    <RouterView />
    <BottomNavbar v-if="showBottomNavbar" :variant="isModernRoute ? 'modern' : 'light'" />
  </div>
</template>

<style>
@import './vuexy/assets/styles/styles.scss';
@import './styles/modern-design.css';

.vuexy-app {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 1rem;
}

.vuexy-app.modern-layout {
  padding: 0 !important;
  background-color: transparent !important;
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  background-color: #fff;
}

.card-body {
  padding: 1.5rem;
}

body {
  /* Removido: o padding inferior será aplicado apenas quando a BottomNavbar estiver visível */
}

/* Aplica padding inferior quando a BottomNavbar está presente */
.has-bottom-navbar {
  padding-bottom: 80px;
}

/* Padding maior em telas médias e grandes */
@media (min-width: 768px) {
  .vuexy-app { padding: 1.5rem; }
}

@media (min-width: 992px) {
  .vuexy-app { padding: 2rem; }
}

/* Dark Mode Variables */
:root {
  --bg-page: #f8f8f8;
  --bg-card: #ffffff;
  --text-main: #2c3e50;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --header-bg: linear-gradient(135deg, #2563EB, #222844);
}

body.dark-mode {
  --bg-page: #161d31;
  --bg-card: #283046;
  --text-main: #d0d2d6;
  --text-muted: #b4b7bd;
  --border-color: #3b4253;
  --header-bg: linear-gradient(135deg, #1e1e2d, #161d31);
  background-color: var(--bg-page);
  color: var(--text-main);
}

body.dark-mode .vuexy-app {
  background-color: var(--bg-page);
}

body.dark-mode .card {
  background-color: var(--bg-card);
  color: var(--text-main);
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.24);
}

body.dark-mode .config-screen {
  background-color: #161d31 !important;
}

body.dark-mode .config-header {
  background-image: linear-gradient(135deg, #1e1e2d, #161d31) !important;
}

body.dark-mode .option-item,
body.dark-mode .pref-item {
  background: #283046 !important;
}

body.dark-mode .option-title,
body.dark-mode .pref-title,
body.dark-mode .user-name {
  color: #d0d2d6 !important;
}

body.dark-mode .option-sub,
body.dark-mode .pref-sub,
body.dark-mode .user-email,
body.dark-mode .section-title {
  color: #676d7d !important;
}

body.dark-mode .user-item {
  border-bottom-color: #3b4253 !important;
}

body.dark-mode .bottom-navbar {
  background-color: #283046 !important;
  border-top-color: #3b4253 !important;
}

body.dark-mode .nav-item {
  color: #b4b7bd !important;
}

body.dark-mode .nav-item.active {
  color: #7367f0 !important;
}

body.dark-mode .modal-content {
  background-color: #283046;
  color: #b4b7bd;
}

body.dark-mode .modal-header {
  border-bottom-color: #3b4253;
}

body.dark-mode .modal-footer {
  border-top-color: #3b4253;
}

body.dark-mode .close {
  color: #b4b7bd;
}
</style>
