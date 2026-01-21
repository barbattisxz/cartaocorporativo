import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import OCR from '../components/ocr.vue'
import Home from '../pages/Home.vue'
import Carteira from '../pages/Carteira.vue'
import Fatura from '../pages/Fatura.vue'
import FaturaDetalhe from '../pages/FaturaDetalhe.vue'
import Configuracao from '../pages/Configuracao.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/ocr', name: 'ocr', component: OCR },
  { path: '/carteira', name: 'carteira', component: Carteira },
  { path: '/fatura', name: 'fatura', component: Fatura },
  { path: '/fatura/:id', name: 'fatura-detalhe', component: FaturaDetalhe },
  { path: '/configuracao', name: 'configuracao', component: Configuracao },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

function getRoleFromToken(): string | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const payload = JSON.parse(json)
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

router.beforeEach((to, from, next) => {
  if (to.name === 'configuracao') {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ name: 'login' })
      return
    }
    const role = getRoleFromToken()
    if (role === 'ADMIN') {
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router
