<template>
  <div class="glass-card p-5 mb-4 relative overflow-hidden group hover:bg-white/5 transition-all duration-300 border-l-4" :class="statusColorClass">
    <!-- Background Gradient Effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div class="relative z-10 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- Card Icon -->
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" :class="iconBgClass">
          <i :class="[cardIcon, 'text-2xl text-white drop-shadow-md']"></i>
        </div>
        
        <div class="flex flex-col">
          <div class="font-bold text-white text-lg tracking-wide">{{ cardType }}</div>
          <div class="text-sm text-white/60 font-mono tracking-wider">•••• {{ cardNumber }}</div>
        </div>
      </div>

      <div class="text-right">
        <div class="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Titular</div>
        <div class="text-sm font-medium text-white/90 mb-1">{{ cardHolder }}</div>
        <div class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border" :class="statusBadgeClass">
          <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="statusDotClass"></span>
          {{ status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  cardType: string
  cardNumber: string
  cardHolder: string
  status: string
}

const props = defineProps<Props>()

const cardIcon = computed(() => {
  const type = props.cardType.toLowerCase()
  if (type.includes('visa')) return 'fab fa-cc-visa'
  if (type.includes('master')) return 'fab fa-cc-mastercard'
  if (type.includes('amex')) return 'fab fa-cc-amex'
  return 'fas fa-credit-card'
})

const statusColorClass = computed(() => {
  return props.status?.toLowerCase() === 'ativo' ? 'border-l-success' : 'border-l-destructive'
})

const iconBgClass = computed(() => {
  const type = props.cardType.toLowerCase()
  if (type.includes('visa')) return 'bg-blue-600/20 border border-blue-500/30'
  if (type.includes('master')) return 'bg-orange-600/20 border border-orange-500/30'
  return 'bg-white/10 border border-white/20'
})

const statusBadgeClass = computed(() => {
  return props.status?.toLowerCase() === 'ativo' 
    ? 'bg-success/10 text-success border-success/20' 
    : 'bg-destructive/10 text-destructive border-destructive/20'
})

const statusDotClass = computed(() => {
  return props.status?.toLowerCase() === 'ativo' ? 'bg-success' : 'bg-destructive'
})
</script>
