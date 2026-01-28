<template>
  <div class="p-6">
    <PageHeader 
      title="Conferência de Fatura" 
      :breadcrumbs="[{ label: 'Dashboard', path: '/' }, { label: 'Faturas' }]"
    />

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Upload Card -->
      <div class="vuexy-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-muted-foreground/20 bg-muted/5">
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <UploadCloud class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-semibold text-foreground mb-2">Carregar Fatura</h2>
        <p class="text-muted-foreground mb-6 max-w-sm">Faça upload da fatura do cartão corporativo para reconciliação automática</p>
        
        <button class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2" @click="triggerUpload">
          <Upload class="w-4 h-4 mr-2" />
          <span>Selecionar arquivo</span>
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,image/*,.txt"
          class="hidden"
          @change="onFileChange"
        />
      </div>

      <!-- Cards List -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-foreground">Cartões Disponíveis</h3>
        <div class="grid gap-4">
          <div 
            v-for="(card, index) in cards" 
            :key="index"
            class="vuexy-card p-4 flex items-center justify-between hover:border-primary transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                {{ card.cardType === 'Visa' ? 'Vi' : 'Mc' }}
              </div>
              <div>
                <p class="font-medium text-foreground">**** **** **** {{ card.cardNumber }}</p>
                <p class="text-sm text-muted-foreground">{{ card.cardHolder }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-success"></span>
              <span class="text-sm font-medium text-muted-foreground">{{ card.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div class="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div class="font-semibold text-foreground">Processando fatura...</div>
        <div class="text-sm text-muted-foreground">Aguarde um instante</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UploadCloud, Upload } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'

const router = useRouter()

interface Card {
  cardType: string
  cardNumber: string
  cardHolder: string
  status: string
}

const cards: Card[] = [
  { cardType: 'Visa', cardNumber: '1234', cardHolder: 'João Silva', status: 'Ativo' },
  { cardType: 'Mastercard', cardNumber: '5678', cardHolder: 'Maria Souza', status: 'Ativo' },
]

const isLoading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerUpload() {
  const el = fileInputRef.value
  if (el) el.click()
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files && target.files[0]
  if (!file) return
  isLoading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('confirm', '1') // Save immediately
    formData.append('context', 'fatura') // Força o backend a tratar como fatura
    // Prompt is now handled by the backend to ensure consistency


    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch('http://localhost:5175/api/ocr', {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
        const err = await response.text()
        throw new Error(`Erro no upload: ${err}`)
    }

    const data = await response.json()
    // Redirect to details if available
    if (data.dbId) {
        router.push(`/fatura-detalhes/${data.dbId}`)
    } else {
        alert('Fatura processada, mas ID não retornado.')
    }

  } catch (err: any) {
    console.error(err)
    alert('Erro ao processar fatura: ' + err.message)
  } finally {
    isLoading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}
</script>
