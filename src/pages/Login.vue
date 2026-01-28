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
        <h1 class="text-4xl font-bold mb-6">Sistema OCR</h1>
        <p class="text-lg opacity-90 leading-relaxed">
          Gerencie suas despesas corporativas com inteligência e praticidade. 
          Reconhecimento automático de faturas e controle total.
        </p>
      </div>
    </div>

    <!-- Right: Login Form -->
    <div class="flex items-center justify-center p-6 bg-background">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-foreground">Bem-vindo! 👋</h2>
          <p class="mt-2 text-muted-foreground">Faça login na sua conta para continuar</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email ou Usuário</label>
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                v-model="credentials.email"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                placeholder="exemplo@email.com ou usuário"
                required
              />
            </div>
            <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Senha</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                v-model="credentials.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10"
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
            <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <input 
                id="rememberMe" 
                v-model="rememberMe" 
                type="checkbox"
                class="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              >
              <label for="rememberMe" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lembrar-me</label>
            </div>
            <a href="#" class="text-sm font-medium text-primary hover:underline">Esqueceu a senha?</a>
          </div>

          <button 
            type="submit" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Novo por aqui? </span>
          <RouterLink to="/register" class="font-medium text-primary hover:underline">Criar uma conta</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)
const isPasswordVisible = ref(false)
const rememberMe = ref(false)

const credentials = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

async function onSubmit() {
  errors.email = ''
  errors.password = ''
  isLoading.value = true
  
  // Simulate login delay or actual API call
  try {
    const response = await fetch('http://localhost:5175/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginOrEmail: credentials.email,
          senha: credentials.password
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha no login')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    router.push('/home')
  } catch (e: any) {
    console.error(e)
    errors.password = e.message || 'Email ou senha incorretos'
  } finally {
    isLoading.value = false
  }
}
</script>
