<template>
  <div class="min-h-screen pb-24 text-white animate-fade-in">
    <header class="glass-header">
      <h1 class="text-xl font-bold text-white tracking-wide flex items-center gap-2">
        <i class="fas fa-receipt text-secondary"></i>
        Despesas
      </h1>
      <div class="text-xs font-medium px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-white/60">
        OCR Scanner
      </div>
    </header>

    <main class="pt-24 px-4 max-w-lg mx-auto space-y-6">
      <!-- Intro / Status -->
      <div class="text-center mb-2">
        <h2 class="text-2xl font-bold text-white mb-1">Nova Despesa</h2>
        <p class="text-sm text-white/60">Digitalize notas fiscais ou faturas para extração automática de dados</p>
      </div>

      <!-- Ações: Abrir Câmera e Ler OCR -->
      <div class="grid grid-cols-2 gap-4">
        <button 
          class="group relative overflow-hidden glass-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all duration-300 border-primary/20 hover:border-primary/50"
          @click="openCameraModal"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
            <i class="fas fa-camera text-2xl text-white"></i>
          </div>
          <div class="text-center relative z-10">
            <span class="block font-bold text-white text-lg">Câmera</span>
            <span class="text-xs text-white/60">Tirar foto agora</span>
          </div>
        </button>

        <button 
          class="group relative overflow-hidden glass-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all duration-300 border-secondary/20 hover:border-secondary/50"
          @click="triggerUpload"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary-dark shadow-lg shadow-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
            <i class="fas fa-file-upload text-2xl text-white"></i>
          </div>
          <div class="text-center relative z-10">
            <span class="block font-bold text-white text-lg">Arquivo</span>
            <span class="text-xs text-white/60">Galeria ou PDF</span>
          </div>
        </button>
        
        <input ref="fileInputRef" type="file" accept=".pdf,image/*,.txt" class="hidden" @change="onFileChange" />
      </div>

      <!-- Dica Rápida -->
      <div class="glass-card p-4 flex items-start gap-3 bg-blue-500/5 border-blue-500/10">
        <i class="fas fa-lightbulb text-yellow-400 mt-1"></i>
        <p class="text-xs text-white/70 leading-relaxed">
          <strong class="text-white block mb-0.5">Dica:</strong>
          Certifique-se de que a imagem esteja bem iluminada e os valores visíveis para melhor precisão.
        </p>
      </div>

      <!-- Modal de Câmera (apenas web) -->
      <transition name="fade">
        <div v-if="cameraOpen" class="fixed inset-0 bg-black/95 backdrop-blur-md z-[2000] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div class="glass-card w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden p-0 shadow-2xl border border-white/20 relative">
            
            <!-- Camera Header -->
            <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <h2 class="text-lg font-bold text-white flex items-center gap-2 drop-shadow-md">
                <i class="fas fa-camera text-primary"></i> Scanner
              </h2>
              <button class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20 transition-all" @click="closeCamera" aria-label="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Camera Viewport -->
            <div class="bg-black relative flex-1 flex items-center justify-center overflow-hidden">
              <video ref="cameraVideoRef" autoplay playsinline class="w-full h-full object-cover"></video>
              
              <!-- Guides -->
              <div class="absolute inset-8 border-2 border-white/30 rounded-lg pointer-events-none flex flex-col justify-between">
                <div class="flex justify-between">
                  <div class="w-4 h-4 border-t-2 border-l-2 border-white"></div>
                  <div class="w-4 h-4 border-t-2 border-r-2 border-white"></div>
                </div>
                <div class="flex justify-between">
                  <div class="w-4 h-4 border-b-2 border-l-2 border-white"></div>
                  <div class="w-4 h-4 border-b-2 border-r-2 border-white"></div>
                </div>
              </div>
              
              <!-- Scan Line Animation -->
              <div class="absolute top-1/2 left-8 right-8 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-scan"></div>

              <p v-if="cameraError" class="text-white bg-red-500/90 px-4 py-2 rounded-lg text-sm absolute bottom-20 mx-auto backdrop-blur-md shadow-lg">{{ cameraError }}</p>
            </div>

            <!-- Camera Controls -->
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center items-center gap-8">
               <button class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md" @click="closeCamera">
                 <i class="fas fa-times"></i>
               </button>
               
               <button class="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-lg hover:scale-105 transition-all active:scale-95" @click="captureFromCamera">
                 <div class="w-16 h-16 bg-white rounded-full"></div>
               </button>
               
               <button class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-md">
                 <i class="fas fa-bolt"></i> <!-- Placeholder for flash -->
               </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Apenas a segunda aba (TesseractOCR) -->
      <div class="w-full animate-slide-up" style="animation-delay: 0.1s;">
        <div class="glass-card p-1">
          <TesseractOCR
            ref="tesseractOcrRef"
            @ocr-completed="handleOcrCompleted"
            @ocr-progress="handleOcrProgress"
          />
        </div>
      </div>
    </main>

    <BottomNavbar variant="modern" />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import TesseractOCR from './TesseractOCR.vue';
import BottomNavbar from './BottomNavbar.vue';

const ocrProgress = ref(0);
const tesseractOcrRef = ref(null);
const fileInputRef = ref(null);
const cameraOpen = ref(false);
const cameraError = ref('');
const cameraVideoRef = ref(null);
let cameraStream = null;

function handleOcrCompleted(result) {
  console.log('OCR concluído com sucesso:', result);
}

function handleOcrProgress(progress) {
  ocrProgress.value = progress;
}

// Upload para OCR direto
function triggerUpload() {
  const el = fileInputRef.value;
  if (el) el.click();
}

function onFileChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  console.log('Arquivo selecionado na tela:', file.name);
  
  if (tesseractOcrRef.value) {
    tesseractOcrRef.value.runOCR(file);
  }
}

// Abrir modal e inicializar câmera (web)
async function openCameraModal() {
  cameraError.value = '';
  cameraOpen.value = true;
  await nextTick();
  await initCamera();
}

async function initCamera() {
  try {
    if (!navigator?.mediaDevices?.getUserMedia) throw new Error('Navegador sem suporte à câmera');
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = cameraVideoRef.value;
    if (video) {
      video.srcObject = cameraStream;
      await video.play();
    }
  } catch (err) {
    cameraError.value = err?.message || String(err);
  }
}

async function captureFromCamera() {
  try {
    const video = cameraVideoRef.value;
    if (!video) return;
    
    // 1. Trava a câmera (congela a imagem)
    video.pause();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 1));
    
    if (blob && tesseractOcrRef.value) {
      await tesseractOcrRef.value.runOCR(blob);
    }
    closeCamera(); // Fecha após capturar para ver o resultado
  } catch (err) {
    cameraError.value = err?.message || String(err);
    // Se der erro, tenta retomar o vídeo
    const video = cameraVideoRef.value;
    if (video) video.play();
  }
}

function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  cameraOpen.value = false;
}
</script>

<style scoped>
@keyframes scan {
  0% { top: 10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}
</style>
