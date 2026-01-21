import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default function installVuetify(app: any) {
  const vuetify = createVuetify({
    // Minimal setup without Vuexy-specific adapters
  })
  app.use(vuetify)
}