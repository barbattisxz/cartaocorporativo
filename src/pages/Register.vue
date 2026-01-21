<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center">
    <div class="glass-card p-0 overflow-hidden d-flex flex-column flex-md-row shadow-2xl" style="max-width: 900px; width: 95%; min-height: 600px;">
      
      <!-- Coluna da Ilustração (Esquerda) -->
      <div class="d-none d-md-flex flex-column justify-content-center align-items-center p-5 text-white position-relative overflow-hidden" style="flex: 1; background: linear-gradient(135deg, hsl(234 89% 65%), hsl(270 60% 55%));">
        <!-- Elementos decorativos de fundo -->
        <div class="position-absolute top-0 start-0 w-100 h-100" style="background: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/shapes/waves-white.svg'); background-size: cover; opacity: 0.2;"></div>
        <div class="position-absolute rounded-circle bg-white opacity-10" style="width: 200px; height: 200px; top: -50px; left: -50px;"></div>
        <div class="position-absolute rounded-circle bg-white opacity-10" style="width: 300px; height: 300px; bottom: -100px; right: -50px;"></div>

        <div class="position-relative z-10 text-center">
          <div class="mb-4 d-inline-block p-4 rounded-circle bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
            <i class="fas fa-user-plus fa-4x text-white"></i>
          </div>
          <h2 class="display-6 fw-bold mb-3">Junte-se a nós</h2>
          <p class="lead opacity-90 mb-4">
            Crie sua conta e comece a gerenciar suas notas fiscais com facilidade e inteligência.
          </p>
          <ul class="list-unstyled text-start d-inline-block opacity-80">
            <li class="mb-2"><i class="fas fa-check-circle me-2"></i> Organização automática</li>
            <li class="mb-2"><i class="fas fa-check-circle me-2"></i> Relatórios detalhados</li>
            <li class="mb-0"><i class="fas fa-check-circle me-2"></i> Acesso em qualquer lugar</li>
          </ul>
        </div>
      </div>

      <!-- Coluna do Formulário (Direita) -->
      <div class="d-flex flex-column justify-content-center p-4 p-md-5 bg-slate-900/90 position-relative" style="flex: 1;">
        <!-- Mobile Header -->
        <div class="d-md-none text-center mb-4">
          <i class="fas fa-user-plus fa-3x text-primary mb-2"></i>
          <h2 class="fw-bold text-white">Criar Conta</h2>
        </div>

        <div class="mb-4">
          <h3 class="fw-bold text-white mb-1">Crie sua conta 🚀</h3>
          <p class="text-white-50">Preencha os dados abaixo para começar.</p>
        </div>

        <form @submit.prevent="onSubmit">
          <!-- Nome -->
          <div class="mb-3">
            <label for="nome" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide">Nome Completo</label>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-user"></i></span>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.nome }"
                placeholder="Seu nome"
                required
              >
            </div>
            <div v-if="errors.nome" class="text-danger text-xs mt-1">{{ errors.nome }}</div>
          </div>

          <!-- Login (Username) -->
          <div class="mb-3">
            <label for="login" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide">Usuário (Login)</label>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-at"></i></span>
              <input
                id="login"
                v-model="form.login"
                type="text"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.login }"
                placeholder="usuario123"
                required
              >
            </div>
            <div v-if="errors.login" class="text-danger text-xs mt-1">{{ errors.login }}</div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-envelope"></i></span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.email }"
                placeholder="exemplo@email.com"
                required
              >
            </div>
            <div v-if="errors.email" class="text-danger text-xs mt-1">{{ errors.email }}</div>
          </div>

          <!-- Senha -->
          <div class="mb-4">
            <label for="senha" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide">Senha</label>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-lock"></i></span>
              <input
                id="senha"
                v-model="form.senha"
                :type="isPasswordVisible ? 'text' : 'password'"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.senha }"
                placeholder="············"
                required
              >
              <button type="button" class="btn btn-outline-secondary bg-white/5 border-white/10 text-white-50 hover:bg-white/10 hover:text-white border-start-0" @click="isPasswordVisible = !isPasswordVisible">
                <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.senha" class="text-danger text-xs mt-1">{{ errors.senha }}</div>
          </div>

          <!-- Botão de registro -->
          <button type="submit" class="gradient-btn w-100 mb-4 d-flex justify-content-center align-items-center gap-2" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
            <span v-else>Cadastrar <i class="fas fa-user-plus ms-1 text-sm"></i></span>
          </button>

          <!-- Link para login -->
          <div class="text-center">
            <p class="text-white-50 text-sm mb-0">
              Já tem uma conta?
              <router-link to="/login" class="text-primary fw-bold text-decoration-none hover:text-primary-light ml-1">Fazer login</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const errors = ref({})
const form = ref({
  nome: '',
  login: '',
  email: '',
  senha: ''
})

const register = async () => {
  try {
    isLoading.value = true
    errors.value = {}
    
    const response = await fetch('http://localhost:5175/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.error && data.error.includes('Login')) {
        errors.value.login = data.error
      } else if (data.error && data.error.includes('email')) {
        errors.value.email = data.error
      } else {
        alert(data.error || 'Erro ao registrar')
      }
      return
    }

    alert('Cadastro realizado com sucesso! Faça login.')
    router.push('/login')

  } catch (err) {
    console.error(err)
    alert('Erro de conexão com o servidor')
  } finally {
    isLoading.value = false
  }
}

const onSubmit = () => {
  errors.value = {}
  
  if (!form.value.nome) errors.value.nome = 'Nome é obrigatório'
  if (!form.value.login) errors.value.login = 'Login é obrigatório'
  if (!form.value.email) errors.value.email = 'Email é obrigatório'
  if (!form.value.senha) errors.value.senha = 'Senha é obrigatória'
  else if (form.value.senha.length < 6) errors.value.senha = 'A senha deve ter no mínimo 6 caracteres'

  if (Object.keys(errors.value).length === 0) {
    register()
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, hsl(234 89% 65%), hsl(270 60% 55%));
  padding: 1rem;
}

/* Custom form control styles */
.form-control:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

.input-group-text {
  border-right: none;
}

.form-control {
  border-left: none;
}
</style>
