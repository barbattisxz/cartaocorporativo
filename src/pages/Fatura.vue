<template>
  <div class="min-h-screen pb-24 text-white">
    <header class="glass-header">
      <h1 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="fas fa-file-invoice-dollar text-primary"></i>
        Faturas
      </h1>
      <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
        <i class="fas fa-plus text-sm text-white"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-lg mx-auto space-y-6">
      <!-- Fatura Resumo -->
      <div class="glass-card p-6 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm text-white/60 font-medium">Fatura Atual</p>
              <h2 class="text-4xl font-bold text-white mt-1 tracking-tight">
                R$ <span class="text-primary">3.450</span>,00
              </h2>
            </div>
            <div class="text-right">
              <div class="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Vencimento</div>
              <div class="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                10 JUN
              </div>
            </div>
          </div>

          <div class="w-full bg-white/10 rounded-full h-1.5 mb-4 overflow-hidden">
            <div class="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style="width: 70%"></div>
          </div>

          <div class="flex gap-3">
            <button class="gradient-btn flex-1 py-3 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all">
              <i class="fas fa-barcode mr-2"></i> Pagar Fatura
            </button>
            <button class="glass-card border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex-1 text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg">
              <i class="fas fa-file-pdf text-secondary"></i> PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="glass-card-strong p-6 text-center cursor-pointer hover:bg-white/5 transition-all duration-300 group border-dashed border-2 border-white/10 hover:border-primary/50">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
          <i class="fas fa-cloud-upload-alt text-3xl text-primary group-hover:text-white transition-colors"></i>
        </div>
        <h2 class="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Carregar Nova Fatura</h2>
        <p class="text-sm text-white-60 leading-relaxed max-w-xs mx-auto">
          Arraste ou clique para fazer upload da fatura do cartão corporativo para reconciliação automática
        </p>
      </div>

      <!-- Meus Cartões -->
      <div>
        <div class="flex justify-between items-end mb-4 px-2">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-credit-card text-secondary"></i>
            Cartões Vinculados
          </h3>
          <span class="text-xs text-white/40 font-medium uppercase tracking-wider">{{ cards.length }} ativos</span>
        </div>
        <div class="space-y-4 animate-slide-up">
          <CardItem
            v-for="(card, index) in cards"
            :key="index"
            v-bind="card"
          />
        </div>
      </div>
    </main>

    <BottomNavbar variant="modern" />
  </div>
</template>

<script setup lang="ts">
import BottomNavbar from '../components/BottomNavbar.vue'
import CardItem from '../components/CardItem.vue'

interface Card {
  cardType: string
  cardNumber: string
  cardHolder: string
  status: string
}

const cards: Card[] = [
  { cardType: 'Visa Platinum', cardNumber: '4242', cardHolder: 'João Silva', status: 'Ativo' },
  { cardType: 'Mastercard Black', cardNumber: '8899', cardHolder: 'João Silva', status: 'Ativo' },
]
</script>
