<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { Menu } from 'lucide-vue-next'

const route = useRoute()
const isSidebarOpen = ref(false)

watch(route, () => {
  isSidebarOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <Sidebar v-if="!route.meta.hideSidebar" :isOpen="isSidebarOpen" />
    
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen && !route.meta.hideSidebar" 
      class="fixed inset-0 z-40 bg-black/50 md:hidden glass-backdrop"
      @click="isSidebarOpen = false"
    ></div>

    <main :class="{ 'md:ml-64': !route.meta.hideSidebar, 'p-4 md:p-8': !route.meta.hideSidebar }">
      <!-- Mobile Header -->
      <div v-if="!route.meta.hideSidebar" class="md:hidden flex items-center justify-between mb-4">
        <button @click="isSidebarOpen = true" class="p-2 -ml-2 rounded-md hover:bg-accent text-foreground transition-colors">
          <Menu class="w-6 h-6" />
        </button>
        <span class="font-semibold text-lg">Despesas</span>
        <div class="w-6"></div> <!-- Spacer -->
      </div>

      <RouterView />
    </main>
  </div>
</template>

<style>
/* Remove old styles imports if needed, but tailwind.css is imported in main.ts */
.glass-backdrop {
  backdrop-filter: blur(4px);
}
</style>
