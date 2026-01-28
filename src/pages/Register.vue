<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Left: Illustration/Brand -->
    <div class="hidden lg:flex flex-col items-center justify-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div class="relative z-10 text-center max-w-lg">
        <div class="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm">
          <FileText class="w-12 h-12" />
        </div>
        <h1 class="text-4xl font-bold mb-6">Junte-se a nós</h1>
        <p class="text-lg opacity-90 leading-relaxed">
          Crie sua conta e comece a gerenciar suas notas fiscais com facilidade e automação.
        </p>
      </div>
    </div>

    <!-- Right: Register Form -->
    <div class="flex items-center justify-center p-6 bg-background">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-foreground">Crie sua conta 🚀</h2>
          <p class="mt-2 text-muted-foreground">Preencha os dados abaixo para começar</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="space-y-2">
            <label for="nome" class="text-sm font-medium leading-none">Nome Completo</label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="login" class="text-sm font-medium leading-none">Usuário (Login)</label>
            <div class="relative">
              <AtSign class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="login"
                v-model="form.login"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                placeholder="usuario123"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                placeholder="exemplo@email.com"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="senha" class="text-sm font-medium leading-none">Senha</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="senha"
                v-model="form.senha"
                :type="isPasswordVisible ? 'text' : 'password'"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 pr-10"
                placeholder="············"
                required
              />
              <button 
                type="button" 
                class="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                <component :is="isPasswordVisible ? EyeOff : Eye" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            {{ isLoading ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </form>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Já tem uma conta? </span>
          <RouterLink to="/login" class="font-medium text-primary hover:underline">Faça login</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, Mail, Lock, Eye, EyeOff, User, AtSign } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)
const isPasswordVisible = ref(false)

const form = reactive({
  nome: '',
  login: '',
  email: '',
  senha: ''
})

async function onSubmit() {
  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:5175/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })

    if (!response.ok) {
        throw new Error('Falha no cadastro')
    }

    // Auto login after register or redirect to login
    router.push('/login')
  } catch (e) {
    console.error(e)
    alert('Erro ao criar conta. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}
</script>
