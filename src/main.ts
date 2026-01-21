import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Importando Bootstrap e BootstrapVue3
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import router from './router'

// Importando estilos do Vuexy
import './vuexy/assets/styles/styles.scss'
// Registrar Vuetify (setup minimalista) via caminho relativo
import installVuetify from './plugins/vuetify'

// Importando Font Awesome
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
document.head.appendChild(link)

const app = createApp(App)
app.use(BootstrapVue3)
app.use(router)
installVuetify(app)
app.mount('#app')

// Registro manual do Service Worker do PWA com salvaguardas
// Evita erros em ambientes de preview/iframe e garante registro apenas quando suportado
import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    try {
      registerSW({ immediate: true })
    } catch (err) {
      console.warn('Falha ao registrar Service Worker:', err)
    }
  })
}