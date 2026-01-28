<template>
  <div class="p-6">
    <PageHeader 
      title="Meu Perfil"
      subtitle="Gerencie suas informações pessoais e configurações"
      :breadcrumbs="[{ label: 'Perfil' }]"
    />

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="vuexy-card p-6 animate-fade-in">
        <div class="text-center">
          <div class="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl font-bold text-primary">TE</span>
          </div>
          <h2 class="text-xl font-semibold text-foreground mb-1">Teste</h2>
          <p class="text-muted-foreground mb-4">teste@empresa.com</p>
          <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
            Colaborador
          </span>

          <div class="mt-6 pt-6 border-t border-border space-y-4">
            <div class="flex items-center gap-3 text-left">
              <Mail class="w-5 h-5 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Email</p>
                <p class="text-sm text-foreground">teste@empresa.com</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-left">
              <Phone class="w-5 h-5 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Telefone</p>
                <p class="text-sm text-foreground">(11) 99999-9999</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-left">
              <Building2 class="w-5 h-5 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Empresa</p>
                <p class="text-sm text-foreground">Empresa LTDA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Options -->
      <div class="lg:col-span-2 space-y-4">
        <div class="vuexy-card animate-fade-in" style="animation-delay: 100ms;">
          <div class="p-6 border-b border-border">
            <h2 class="text-lg font-semibold text-foreground">Configurações</h2>
          </div>
          <div class="divide-y divide-border">
            <button
              v-for="(item, index) in menuItems"
              :key="item.label"
              class="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left animate-fade-in"
              :style="{ animationDelay: `${Math.min(index + 2, 4) * 100}ms` }"
            >
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-foreground">{{ item.label }}</p>
                <p class="text-sm text-muted-foreground">{{ item.description }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Logout -->
        <button class="w-full vuexy-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors animate-fade-in" style="animation-delay: 400ms;">
          <LogOut class="w-5 h-5" />
          <span class="font-medium">Sair da conta</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Mail, Phone, Building2, Shield, Bell, CreditCard, Settings, LogOut } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'

const menuItems = [
  { icon: User, label: "Dados Pessoais", description: "Edite suas informações pessoais" },
  { icon: CreditCard, label: "Cartões", description: "Gerencie seus cartões corporativos" },
  { icon: Bell, label: "Notificações", description: "Configure alertas e notificações" },
  { icon: Shield, label: "Segurança", description: "Altere sua senha e configurações de segurança" },
  { icon: Settings, label: "Configurações", description: "Preferências gerais do aplicativo" },
]
</script>