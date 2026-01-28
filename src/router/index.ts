import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Home.vue'
import NovaDespesa from '../pages/NovaDespesa.vue'
import Cartoes from '../pages/Cartoes.vue'
import Fatura from '../pages/Fatura.vue'
import FaturaDetalhes from '../pages/FaturaDetalhes.vue'
import Perfil from '../pages/Perfil.vue'
import Despesas from '../pages/Despesas.vue'
import Admin from '../pages/Admin.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login, meta: { hideSidebar: true } },
  { path: '/register', name: 'register', component: Register, meta: { hideSidebar: true } },
  { path: '/home', name: 'home', component: Home },
  { path: '/nova-despesa', name: 'nova-despesa', component: NovaDespesa },
  { path: '/cartoes', name: 'cartoes', component: Cartoes },
  { path: '/fatura', name: 'fatura', component: Fatura },
  { path: '/fatura-detalhes/:id', name: 'fatura-detalhes', component: FaturaDetalhes },
  { path: '/despesas', name: 'despesas', component: Despesas },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/perfil', name: 'perfil', component: Perfil },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
