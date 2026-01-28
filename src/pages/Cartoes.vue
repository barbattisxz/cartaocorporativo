<template>
  <div class="p-6">
    <PageHeader 
      title="Cartões Corporativos"
      subtitle="Gerencie os cartões da sua empresa"
      :breadcrumbs="[{ label: 'Cartões' }]"
    />

    <div class="flex justify-end mb-6">
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2">
        <Plus class="w-4 h-4 mr-2" />
        Novo Cartão
      </button>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(card, index) in mockCards" 
        :key="card.id"
        class="vuexy-card p-6 animate-fade-in"
        :style="{ animationDelay: `${Math.min(index + 1, 4) * 100}ms` }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard class="w-6 h-6" />
          </div>
          <button class="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div class="mb-4">
          <p class="text-lg font-semibold text-foreground">{{ card.brand }}</p>
          <p class="text-muted-foreground">•••• •••• •••• {{ card.lastDigits }}</p>
        </div>

        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-xs text-muted-foreground">Titular</p>
            <p class="text-sm font-medium text-foreground">{{ card.holderName }}</p>
          </div>
          <span 
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            :class="card.status === 'ativo' ? 'border-transparent bg-success/10 text-success hover:bg-success/20' : 'border-transparent bg-warning/10 text-warning hover:bg-warning/20'"
          >
            {{ card.status === 'ativo' ? 'Ativo' : 'Inativo' }}
          </span>
        </div>

        <div class="pt-4 border-t border-border">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-muted-foreground">Utilizado</span>
            <span class="font-medium text-foreground">{{ card.used }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Limite</span>
            <span class="font-medium text-foreground">{{ card.limit }}</span>
          </div>
          <div class="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary rounded-full"
              :style="{ width: getPercentage(card.used, card.limit) }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CreditCard, Plus, MoreVertical } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'

const mockCards = [
  { 
    id: 1, 
    brand: "Visa", 
    lastDigits: "1234", 
    holderName: "João Silva", 
    status: "ativo",
    limit: "R$ 5.000,00",
    used: "R$ 1.250,00"
  },
  { 
    id: 2, 
    brand: "Mastercard", 
    lastDigits: "5678", 
    holderName: "Maria Souza", 
    status: "ativo",
    limit: "R$ 3.000,00",
    used: "R$ 890,00"
  },
  { 
    id: 3, 
    brand: "Elo", 
    lastDigits: "9012", 
    holderName: "Carlos Santos", 
    status: "inativo",
    limit: "R$ 2.000,00",
    used: "R$ 0,00"
  },
]

function getPercentage(used: string, limit: string) {
  const usedVal = parseFloat(used.replace(/[^\d,]/g, '').replace(',', '.'))
  const limitVal = parseFloat(limit.replace(/[^\d,]/g, '').replace(',', '.'))
  return `${(usedVal / limitVal) * 100}%`
}
</script>