import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 55173,
    host: true
  },
  plugins: [
    vue(),
    VitePWA({
      // Reativa o Service Worker em desenvolvimento
      devOptions: { enabled: true },
      injectRegister: 'script',
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'favicon.ico'],
      manifest: {
        name: 'OCR Nota Fiscal',
        short_name: 'OCR App',
        description: 'Aplicativo para ler notas fiscais com OCR',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tesseract-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})