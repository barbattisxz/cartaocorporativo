<template>
  <div class="page-header animate-fade-in mb-6">
    <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="flex items-center text-sm text-muted-foreground mb-2">
      <RouterLink to="/" class="flex items-center hover:text-foreground transition-colors">
        <Home class="w-4 h-4" />
      </RouterLink>
      <div v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <ChevronRight class="w-4 h-4 mx-2" />
        <RouterLink 
          v-if="item.path" 
          :to="item.path" 
          class="hover:text-foreground transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="text-foreground font-medium">
          {{ item.label }}
        </span>
      </div>
    </nav>
    <h1 class="text-2xl font-bold text-foreground">{{ title }}</h1>
    <p v-if="subtitle" class="text-muted-foreground mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { Home, ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; path?: string }[]
}>()
</script>
