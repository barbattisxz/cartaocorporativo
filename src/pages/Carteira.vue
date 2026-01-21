<template>
  <div class="min-h-screen pb-24 text-white">
    <header class="glass-header">
      <h1 class="text-xl font-bold text-white flex items-center gap-2">
        <i class="fas fa-wallet text-secondary"></i>
        Carteira
      </h1>
      <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
        <i class="fas fa-bell text-sm text-white"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-lg mx-auto space-y-6">
      <!-- Saldo Total -->
      <div class="glass-card p-6 relative overflow-hidden group">
        <!-- Glow Effect -->
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all duration-500"></div>
        <div class="absolute -left-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>

        <div class="relative z-10">
          <p class="text-sm text-white/60 mb-1 font-medium">Saldo Total Estimado</p>
          <h2 class="text-4xl font-bold text-white mb-6 tracking-tight">
            R$ <span class="text-secondary">12.450</span>,00
          </h2>
          <div class="flex gap-3">
            <button class="gradient-btn flex-1 text-sm py-3 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all">
              <i class="fas fa-plus mr-2"></i> Adicionar
            </button>
            <button class="glass-card border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 px-4 flex-1 text-sm font-bold transition-all border-white/10 hover:border-white/30 flex items-center justify-center">
              <i class="fas fa-exchange-alt mr-2"></i> Transferir
            </button>
          </div>
        </div>
      </div>

      <!-- Meus Cartões -->
      <div>
        <div class="flex justify-between items-center mb-4 px-1">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-credit-card text-primary"></i>
            Meus Cartões
          </h3>
          <button class="text-primary text-xs font-bold hover:text-primary-light transition-colors uppercase tracking-wider border border-primary/20 px-2 py-1 rounded-lg hover:bg-primary/10">
            + Novo
          </button>
        </div>
        
        <div class="space-y-4 animate-slide-up">
          <!-- Cartão 1 -->
          <div class="glass-card p-5 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-white/10 hover:border-white/30 transition-all group relative overflow-hidden">
             <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                <i class="fab fa-cc-visa text-6xl text-white"></i>
             </div>
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-6">
                <i class="fab fa-cc-visa text-2xl text-white/90"></i>
                <span class="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">Crédito</span>
                </div>
                <div class="mb-5">
                <div class="text-xl font-mono tracking-widest text-white shadow-black drop-shadow-md">•••• •••• •••• 4242</div>
                </div>
                <div class="flex justify-between items-end">
                <div>
                    <div class="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">Titular</div>
                    <div class="text-sm font-bold text-white">JOAO SILVA</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">Validade</div>
                    <div class="text-sm font-bold text-white">12/28</div>
                </div>
                </div>
            </div>
          </div>

          <!-- Cartão 2 -->
          <div class="glass-card p-5 border-white/10 hover:bg-white/5 transition-all group relative overflow-hidden">
             <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <i class="fab fa-cc-mastercard text-6xl text-white"></i>
             </div>
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-6">
                <i class="fab fa-cc-mastercard text-2xl text-white/90"></i>
                <span class="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">Débito</span>
                </div>
                <div class="mb-5">
                <div class="text-xl font-mono tracking-widest text-white/90">•••• •••• •••• 8899</div>
                </div>
                <div class="flex justify-between items-end">
                <div>
                    <div class="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">Titular</div>
                    <div class="text-sm font-bold text-white">JOAO SILVA</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-1">Validade</div>
                    <div class="text-sm font-bold text-white">05/26</div>
                </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Histórico Recente -->
      <div>
        <h3 class="text-lg font-bold text-white mb-4 px-1 flex items-center gap-2">
           <i class="fas fa-history text-accent"></i>
           Atividade Recente
        </h3>
        <div class="glass-card p-0 overflow-hidden border-white/10">
          <div class="divide-y divide-white/5">
            <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div>
                  <div class="font-bold text-white text-sm">Supermercado</div>
                  <div class="text-xs text-white/50">Hoje, 14:30</div>
                </div>
              </div>
              <div class="font-bold text-white">- R$ 450,00</div>
            </div>
            
            <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                  <i class="fas fa-arrow-down"></i>
                </div>
                <div>
                  <div class="font-bold text-white text-sm">Depósito Recebido</div>
                  <div class="text-xs text-white/50">Ontem, 09:15</div>
                </div>
              </div>
              <div class="font-bold text-green-400">+ R$ 2.500,00</div>
            </div>
            
            <div class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <i class="fas fa-car"></i>
                </div>
                <div>
                  <div class="font-bold text-white text-sm">Uber</div>
                  <div class="text-xs text-white/50">20/05/2025</div>
                </div>
              </div>
              <div class="font-bold text-white">- R$ 24,90</div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <BottomNavbar variant="modern" />
  </div>
</template>

<script setup lang="ts">
import BottomNavbar from '../components/BottomNavbar.vue'
</script>

<style scoped>
/* Scoped styles removed in favor of modern-design.css */
</style>
