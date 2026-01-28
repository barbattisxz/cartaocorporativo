<template>
  <div class="p-6">
    <PageHeader 
      title="Nova Despesa"
      subtitle="Registre uma nova despesa corporativa"
      :breadcrumbs="[{ label: 'Despesas', path: '/despesas' }, { label: 'Nova' }]"
    />

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Upload / Scan -->
      <div class="vuexy-card p-6 animate-fade-in">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-foreground">Comprovante</h2>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
            <FileText class="w-8 h-8" />
          </div>
          <h3 class="font-medium text-foreground mb-2">Escaneie o comprovante</h3>
          <p class="text-sm text-muted-foreground mb-6">
            Tire uma foto ou faça upload do recibo para preenchimento automático
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="openCameraModal"
              class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2"
            >
              <Camera class="w-4 h-4 mr-2" />
              Câmera
            </button>
            <button 
              @click="triggerUpload"
              class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2"
            >
              <Upload class="w-4 h-4 mr-2" />
              Upload
            </button>
            <input
              ref="fileInputRef"
              type="file"
              accept=".pdf,image/*,.txt"
              class="hidden"
              @change="onFileChange"
            />
          </div>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="vuexy-card p-6 animate-fade-in" style="animation-delay: 100ms;">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-foreground">Informações</h2>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Valor
            </label>
            <div class="relative">
              <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                v-model="resultAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="flex h-14 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 text-2xl font-bold"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Data
            </label>
            <div class="relative">
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                v-model="resultDate"
                type="date"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Descrição / Estabelecimento
            </label>
            <input
              v-model="resultDescription"
              type="text"
              placeholder="Ex: Almoço com cliente"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Categoria <span class="text-red-500">*</span>
            </label>
            <select
              v-model="resultCategory"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled selected>Selecione uma categoria</option>
              <option value="Fatura de Cartão">Fatura de Cartão</option>
              <option value="Outros">Outros</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Lazer">Lazer</option>
              <option value="Compras">Compras</option>
              <option value="Serviços">Serviços</option>
              <option value="Moradia">Moradia</option>
            </select>
          </div>
        </div>
      </div>

      <!-- OCR Results / Actions -->
      <div class="vuexy-card p-6 animate-fade-in" style="animation-delay: 200ms;">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-foreground">Resumo</h2>
        </div>
        <div>
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-muted/50 rounded-lg">
              <Building2 class="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p class="text-xs text-muted-foreground mb-1">CNPJ</p>
              <p class="font-medium text-foreground">{{ resultCNPJ || '—' }}</p>
            </div>
            <div class="text-center p-4 bg-muted/50 rounded-lg">
              <Calendar class="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p class="text-xs text-muted-foreground mb-1">Data</p>
              <p class="font-medium text-foreground">{{ resultDate || '—' }}</p>
            </div>
            <div class="text-center p-4 bg-muted/50 rounded-lg">
              <DollarSign class="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p class="text-xs text-muted-foreground mb-1">Valor</p>
              <p class="font-medium text-foreground">{{ resultAmount || '—' }}</p>
            </div>
          </div>
          
          <div class="hidden">
             <TesseractOCR
              ref="tesseractOcrRef"
              @ocr-completed="handleOcrCompleted"
              @ocr-progress="handleOcrProgress"
            />
          </div>

          <button 
            @click="saveExpense"
            :disabled="isSaving"
            class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full"
          >
            <span v-if="isSaving" class="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-b-transparent"></span>
            {{ isSaving ? 'Salvando...' : 'Salvar Despesa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Camera Modal -->
    <div v-if="cameraOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-card w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Câmera</h2>
          <button @click="closeCamera" class="text-muted-foreground hover:text-foreground">
            <span class="sr-only">Fechar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 bg-black flex items-center justify-center">
          <video ref="cameraVideoRef" autoplay playsinline class="w-full h-auto max-h-[60vh] object-contain rounded-md"></video>
          <p v-if="cameraError" class="absolute text-destructive text-sm mt-2">{{ cameraError }}</p>
        </div>
        <div class="flex justify-end gap-3 p-4 border-t border-border bg-card">
          <button @click="closeCamera" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2">
            Cancelar
          </button>
          <button @click="captureFromCamera" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2">
            Capturar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div class="font-semibold text-foreground">Processando nota...</div>
        <div class="text-sm text-muted-foreground">Aguarde um instante</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, Upload, FileText, Calendar, DollarSign, Building2 } from 'lucide-vue-next'
import PageHeader from '../components/layout/PageHeader.vue'
import TesseractOCR from '../components/TesseractOCR.vue'

const router = useRouter()
const ocrProgress = ref(0)
const isLoading = ref(false)
const isSaving = ref(false)
const tesseractOcrRef = ref<any>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const cameraOpen = ref(false)
const cameraError = ref('')
const cameraVideoRef = ref<HTMLVideoElement | null>(null)
let cameraStream: MediaStream | null = null
const currentFile = ref<File | Blob | null>(null)

const resultAmount = ref('')
const resultDate = ref(new Date().toISOString().split('T')[0])
const resultCNPJ = ref('')
const resultDescription = ref('')
const resultCategory = ref('') // Começa vazio para obrigar seleção

function handleOcrCompleted(result: any) {
  console.log('OCR concluído com sucesso:', result)
  isLoading.value = false
  
  if (result.fields) {
    // ... campos existentes ...
    if (result.fields.total) resultAmount.value = result.fields.total.toString()
    if (result.fields.data) {
        const dateStr = result.fields.data
        if (dateStr && dateStr.includes('/')) {
            const parts = dateStr.split('/')
            if (parts.length === 3) resultDate.value = `${parts[2]}-${parts[1]}-${parts[0]}`
        } else {
            resultDate.value = result.fields.data
        }
    }
    if (result.fields.cnpj) resultCNPJ.value = result.fields.cnpj
    
    // Tentar extrair do JSON
    try {
        const json = JSON.parse(result.text)
        if (json.estabelecimento) resultDescription.value = json.estabelecimento
        else if (json.descricao) resultDescription.value = json.descricao
        
        // Se a IA detectar fatura, já pré-seleciona
        if (json.tipoGasto && json.tipoGasto.toLowerCase().includes('fatura')) {
             resultCategory.value = 'Fatura de Cartão'
        } else if (json.categoria) {
             // Tenta mapear ou usa Outros
             // Não vamos forçar categoria genérica se não tiver certeza
        }
    } catch (e) {}
  }
}

function handleOcrProgress(progress: number) {
  ocrProgress.value = progress
}

function triggerUpload() {
  const el = fileInputRef.value
  if (el) el.click()
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files && target.files[0]
  if (!file) return
  
  currentFile.value = file

  if (tesseractOcrRef.value) {
    isLoading.value = true
    try {
      await tesseractOcrRef.value.runOCR(file)
    } finally {
      isLoading.value = false
    }
  }
}

async function openCameraModal() {
  cameraError.value = ''
  cameraOpen.value = true
  await nextTick()
  await initCamera()
}

async function initCamera() {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) throw new Error('Navegador sem suporte à câmera')
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    const video = cameraVideoRef.value
    if (video) {
      video.srcObject = cameraStream
      await video.play()
    }
  } catch (err: any) {
    cameraError.value = err?.message || String(err)
  }
}

async function captureFromCamera() {
  try {
    const video = cameraVideoRef.value
    if (!video) return
    
    video.pause()

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(b => resolve(b), 'image/png', 1))
    
    if (blob) {
      currentFile.value = blob
      if (tesseractOcrRef.value) {
        isLoading.value = true
        try {
          await tesseractOcrRef.value.runOCR(blob)
        } finally {
          isLoading.value = false
          closeCamera()
        }
      }
    }
  } catch (err: any) {
    cameraError.value = err?.message || String(err)
    const video = cameraVideoRef.value
    if (video) video.play()
  }
}

function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop())
    cameraStream = null
  }
  cameraOpen.value = false
}

async function saveExpense() {
  if (!resultCategory.value) {
    alert('Por favor, selecione uma Categoria.')
    return
  }

  isSaving.value = true
  try {
    const formData = new FormData()
    formData.append('valorTotal', resultAmount.value)
    formData.append('data', resultDate.value)
    formData.append('estabelecimento', resultDescription.value)
    formData.append('tipoGasto', resultCategory.value)
    
    // Se a categoria for Fatura de Cartão, forçamos o contexto
    if (resultCategory.value === 'Fatura de Cartão') {
        formData.append('context', 'fatura')
    }
    
    if (currentFile.value) {
      formData.append('file', currentFile.value, 'comprovante.png')
    }

    // Tentar salvar usando a rota de expenses
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    let userId = ''
    if (userStr) {
        try {
            const u = JSON.parse(userStr)
            userId = u.id || u.id_beneficiario
        } catch (e) {}
    }

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    // Se for Fatura, vamos direto para /api/ocr com confirm=1 para garantir processamento completo
    if (resultCategory.value === 'Fatura de Cartão') {
        const ocrFormData = new FormData()
        if (currentFile.value) ocrFormData.append('file', currentFile.value)
        ocrFormData.append('confirm', '1')
        ocrFormData.append('context', 'fatura')
        if (userId) ocrFormData.append('userId', userId.toString())
        
        // Passamos metadados também para garantir
        ocrFormData.append('valorTotal', resultAmount.value)
        ocrFormData.append('data', resultDate.value)
        
        const response = await fetch('http://localhost:5175/api/ocr', {
            method: 'POST',
            headers,
            body: ocrFormData
        })
        
        if (!response.ok) throw new Error('Erro ao processar fatura')
        
        const data = await response.json()
        if (data.dbId) {
             router.push(`/fatura-detalhes/${data.dbId}`)
             return // Sai da função para não redirecionar para despesas
        }
    } else {
        // Fluxo normal de despesa
        let response = await fetch('http://localhost:5175/api/expenses', {
          method: 'POST',
          headers,
          body: formData
        })
        
        if (!response.ok) throw new Error('Erro ao salvar despesa')
    }

    router.push('/despesas')
  } catch (error: any) {
    console.error('Erro ao salvar despesa:', error)
    alert('Erro ao salvar despesa: ' + error.message)
  } finally {
    isSaving.value = false
  }
}
</script>