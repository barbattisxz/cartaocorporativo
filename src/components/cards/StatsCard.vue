<template>
  <div 
    class="stats-card animate-fade-in"
    :class="delayClass"
  >
    <div class="stats-icon" :class="variantClass">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <div class="flex-1">
      <p class="text-2xl font-bold text-foreground">{{ value }}</p>
      <p class="text-sm text-muted-foreground">{{ label }}</p>
    </div>
    <div v-if="trend">
      <span class="text-sm font-medium" :class="trend.positive ? 'text-success' : 'text-destructive'">
        {{ trend.positive ? "+" : "" }}{{ trend.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  icon: any
  value: string
  label: string
  variant?: "primary" | "success" | "warning" | "info"
  trend?: { value: string; positive: boolean }
  delay?: number
}>(), {
  variant: 'primary',
  delay: 0
})

const variantClasses: Record<string, string> = {
  primary: "stats-icon-primary",
  success: "stats-icon-success",
  warning: "stats-icon-warning",
  info: "stats-icon-info",
}

const variantClass = computed(() => variantClasses[props.variant] || variantClasses.primary)

const delayClass = computed(() => {
  return props.delay ? `animate-fade-in-delay-${props.delay}` : ''
})
</script>
