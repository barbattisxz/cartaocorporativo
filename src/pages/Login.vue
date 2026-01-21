<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center">
    <div class="glass-card p-0 overflow-hidden d-flex flex-column flex-md-row shadow-2xl" style="max-width: 900px; width: 95%; min-height: 500px;">
      
      <!-- Coluna da Ilustração (Esquerda) -->
      <div class="d-none d-md-flex flex-column justify-content-center align-items-center p-5 text-white position-relative overflow-hidden" style="flex: 1; background: linear-gradient(135deg, hsl(234 89% 65%), hsl(270 60% 55%));">
        <!-- Elementos decorativos de fundo -->
        <div class="position-absolute top-0 start-0 w-100 h-100" style="background: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/shapes/waves-white.svg'); background-size: cover; opacity: 0.2;"></div>
        <div class="position-absolute rounded-circle bg-white opacity-10" style="width: 200px; height: 200px; top: -50px; left: -50px;"></div>
        <div class="position-absolute rounded-circle bg-white opacity-10" style="width: 300px; height: 300px; bottom: -100px; right: -50px;"></div>

        <div class="position-relative z-10 text-center">
          <div class="mb-4 d-inline-block p-4 rounded-circle bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
            <i class="fas fa-eye fa-4x text-white"></i>
          </div>
          <h2 class="display-6 fw-bold mb-3">Sistema OCR</h2>
          <p class="lead opacity-90 mb-4">
            Transforme suas notas fiscais em dados estruturados com inteligência artificial.
          </p>
          <div class="d-flex gap-2 justify-content-center">
            <span class="badge bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-2">Rápido</span>
            <span class="badge bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-2">Seguro</span>
            <span class="badge bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-2">Inteligente</span>
          </div>
        </div>
      </div>

      <!-- Coluna do Formulário (Direita) -->
      <div class="d-flex flex-column justify-content-center p-4 p-md-5 bg-slate-900/90 position-relative" style="flex: 1;">
        <!-- Mobile Header (Visible only on small screens) -->
        <div class="d-md-none text-center mb-4">
          <i class="fas fa-eye fa-3x text-primary mb-2"></i>
          <h2 class="fw-bold text-white">Sistema OCR</h2>
        </div>

        <div class="mb-4">
          <h3 class="fw-bold text-white mb-1">Bem-vindo de volta! 👋</h3>
          <p class="text-white-50">Insira suas credenciais para acessar sua conta.</p>
        </div>

        <form @submit.prevent="onSubmit">
          <!-- Campo de e-mail -->
          <div class="mb-4">
            <label for="email" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-envelope"></i></span>
              <input
                id="email"
                v-model="credentials.email"
                type="email"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.email }"
                placeholder="exemplo@email.com"
                required
              >
            </div>
            <div v-if="errors.email" class="text-danger text-xs mt-1">{{ errors.email }}</div>
          </div>

          <!-- Campo de senha -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label for="password" class="form-label text-white-60 text-xs font-bold uppercase tracking-wide mb-0">Senha</label>
              <a href="#" class="text-primary text-xs hover:text-primary-light text-decoration-none">Esqueceu?</a>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-white/5 border-white/10 text-white-50"><i class="fas fa-lock"></i></span>
              <input
                id="password"
                v-model="credentials.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                class="form-control bg-white/5 border-white/10 text-white placeholder-white-30 focus:bg-white/10 focus:border-primary transition-all"
                :class="{ 'is-invalid': errors.password }"
                placeholder="············"
                required
              >
              <button type="button" class="btn btn-outline-secondary bg-white/5 border-white/10 text-white-50 hover:bg-white/10 hover:text-white border-start-0" @click="isPasswordVisible = !isPasswordVisible">
                <i :class="isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="text-danger text-xs mt-1">{{ errors.password }}</div>
          </div>

          <!-- Lembrar-me -->
          <div class="mb-4 form-check">
            <input id="rememberMe" v-model="rememberMe" class="form-check-input bg-white/10 border-white/20 checked:bg-primary focus:ring-primary" type="checkbox">
            <label class="form-check-label text-white-60 text-sm" for="rememberMe">Lembrar-me neste dispositivo</label>
          </div>

          <!-- Botão de login -->
          <button type="submit" class="gradient-btn w-100 mb-4 d-flex justify-content-center align-items-center gap-2" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
            <span v-else>Entrar <i class="fas fa-arrow-right ms-1 text-sm"></i></span>
          </button>

          <!-- Registro de nova conta -->
          <div class="text-center">
            <p class="text-white-50 text-sm mb-0">
              Não tem uma conta?
              <router-link to="/register" class="text-primary fw-bold text-decoration-none hover:text-primary-light ml-1">Criar conta</router-link>
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

const emit = defineEmits(['login'])
const router = useRouter()

const isPasswordVisible = ref(false)
const isLoading = ref(false)
const errors = ref({ email: undefined, password: undefined })

const credentials = ref({ email: '', password: '' })
const rememberMe = ref(false)

const login = async () => {
  try {
    isLoading.value = true
    errors.value = { email: undefined, password: undefined }
    const response = await fetch('http://localhost:5175/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginOrEmail: credentials.value.email,
        senha: credentials.value.password
      })
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user && data.user.role === 'ADMIN') {
        router.push('/configuracao')
      } else {
        router.push('/home')
      }
      emit('login', data.user)
    } else {
      const data = await response.json()
      errors.value.email = data.error
    }
  } catch (err) {
    console.error(err)
    errors.value.email = 'Erro de conexão com o servidor'
  } finally {
    isLoading.value = false
  }
}

const onSubmit = () => {
  const email = credentials.value.email?.trim() || ''
  const password = credentials.value.password || ''
  errors.value = { email: undefined, password: undefined }
  if (!email) errors.value.email = 'E-mail é obrigatório'
  // else if (!/.+@.+\..+/.test(email)) errors.value.email = 'E-mail deve ser válido' // Allow login with username too
  if (!password) errors.value.password = 'Senha é obrigatória'
  else if (password.length < 3) errors.value.password = 'Senha muito curta'
  if (!errors.value.email && !errors.value.password) login()
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, hsl(234 89% 65%), hsl(270 60% 55%));
  padding: 1rem;
}

/* Custom form control styles to override Bootstrap defaults effectively */
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
