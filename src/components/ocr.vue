<template>
  <div class="ocr-screen">
    <header class="ocr-header">
      <h1 class="ocr-title">Nova Despesa</h1>
      <p class="ocr-subtitle">Registre sua despesa corporativa</p>
    </header>

    <main class="ocr-main">
      <!-- Área de OCR / Upload -->
      <section class="glass-card-strong upload-card">
        <div class="upload-icon-wrapper">
          <div class="upload-icon-circle">
            <VIcon icon="tabler-camera" size="32" class="icon-white" />
          </div>
        </div>
        <h3 class="upload-title">Escaneie o comprovante</h3>
        <p class="upload-text">
          Tire uma foto ou faça upload do recibo para preenchimento automático
        </p>

        <div class="upload-actions">
          <button class="gradient-btn" @click="openCameraModal">
            <VIcon icon="tabler-camera" size="18" class="icon-white" />
            <span>Câmera</span>
          </button>
          <button class="glass-btn" @click="triggerUpload">
            <VIcon icon="tabler-upload" size="18" class="icon-white" />
            <span>Upload</span>
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".pdf,image/*,.txt"
            class="d-none"
            @change="onFileChange"
          />
        </div>
      </section>

      <!-- Formulário visual (a lógica continua com OCR/Tesseract) -->
      <section class="form-section">
        <div class="glass-card">
          <label class="field-label">
            <VIcon icon="tabler-receipt-2" size="16" class="icon-muted" />
            <span>Valor</span>
          </label>
          <div class="field-value-line">
            <span class="field-prefix">R$</span>
            <input
              type="text"
              placeholder="0,00"
              class="field-input-large"
            />
          </div>
        </div>

        <div class="glass-card">
          <label class="field-label">
            <VIcon icon="tabler-calendar" size="16" class="icon-muted" />
            <span>Data</span>
          </label>
          <div class="field-row">
            <span class="field-text">07/01/2025</span>
            <VIcon icon="tabler-chevron-down" size="18" class="icon-muted" />
          </div>
        </div>
      </section>

      <section class="glass-card ocr-result-card">
        <h3 class="ocr-result-title">Resultado do OCR</h3>
        <TesseractOCR
          ref="tesseractOcrRef"
          @ocr-completed="handleOcrCompleted"
          @ocr-progress="handleOcrProgress"
        />
      </section>

      <!-- Modal de Câmera (apenas web) -->
      <div v-if="cameraOpen" class="modal-overlay" role="dialog" aria-modal="true">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Câmera</h2>
            <button class="close-btn" @click="closeCamera" aria-label="Fechar">×</button>
          </div>
          <div class="modal-body">
            <video ref="cameraVideoRef" autoplay playsinline class="camera-video"></video>
            <p v-if="cameraError" class="error-text">{{ cameraError }}</p>
          </div>
          <div class="modal-actions">
            <button class="action-btn primary" @click="captureFromCamera">
              <span>Capturar</span>
            </button>
            <button class="action-btn secondary" @click="closeCamera">
              <span>Fechar</span>
            </button>
          </div>
        </div>
      </div>
    </main>
    <div v-if="isLoading" class="loading-overlay" aria-live="polite" aria-busy="true">
      <div class="loading-box">
        <div class="spinner"></div>
        <div>
          <div style="font-weight:600;">Processando nota...</div>
          <div style="font-size:0.8rem; color:rgba(209,213,219,0.9);">Aguarde um instante</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import TesseractOCR from './TesseractOCR.vue';

const ocrProgress = ref(0);
const isLoading = ref(false);
const tesseractOcrRef = ref(null);
const fileInputRef = ref(null);
const cameraOpen = ref(false);
const cameraError = ref('');
const cameraVideoRef = ref(null);
let cameraStream = null;

function handleOcrCompleted(result) {
  console.log('OCR concluído com sucesso:', result);
  isLoading.value = false;
}

function handleOcrProgress(progress) {
  ocrProgress.value = progress;
}

// Removido: função de exemplo dependente do YoloDetector

// Upload para OCR direto
function triggerUpload() {
  const el = fileInputRef.value;
  if (el) el.click();
}

async function onFileChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  console.log('Arquivo selecionado na tela:', file.name);
  // Nota: Browsers não permitem acesso ao caminho completo do arquivo local por segurança (C:\fakepath\...)
  
  if (tesseractOcrRef.value) {
    isLoading.value = true;
    try {
      await tesseractOcrRef.value.runOCR(file);
    } finally {
      isLoading.value = false;
    }
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
      isLoading.value = true;
      try {
        await tesseractOcrRef.value.runOCR(blob);
      } finally {
        isLoading.value = false;
      }
    }
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
.ocr-screen {
  min-height: 100vh;
  background-color: #0f172a;
  padding: 1.5rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ocr-header {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto 1.5rem auto;
}

.ocr-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.25rem 0;
}

.ocr-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.ocr-main {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .ocr-main {
    flex-direction: row;
    align-items: flex-start;
  }
  .upload-card, .form-section, .ocr-result-card {
    flex: 1;
  }
}

.glass-card {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  backdrop-filter: blur(12px);
  padding: 1rem;
}

.glass-card-strong {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), rgba(15, 23, 42, 0.95));
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.7);
  backdrop-filter: blur(18px);
  padding: 1.5rem;
}

.upload-card {
  text-align: center;
}

.upload-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.upload-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4));
}

.upload-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.upload-text {
  font-size: 0.875rem;
  color: rgba(209, 213, 219, 0.9);
  margin-bottom: 1rem;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gradient-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(to right, #2563eb, #8b5cf6);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

.glass-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

.icon-white {
  color: #ffffff;
}

.icon-muted {
  color: rgba(148, 163, 184, 0.9);
}

.icon-primary {
  color: #2563eb;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.9);
  margin-bottom: 0.5rem;
}

.field-value-line {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.field-prefix {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.9);
}

.field-input-large {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-text {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
}

.field-textarea {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-size: 0.875rem;
  color: #ffffff;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  border-radius: 9999px;
  padding: 0.4rem 0.9rem;
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(15, 23, 42, 0.9);
  color: rgba(226, 232, 240, 0.9);
}

.chip-primary {
  background: linear-gradient(to right, #2563eb, #8b5cf6);
  color: #ffffff;
}

.attachment-label {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.9);
  margin-bottom: 0.5rem;
}

.attachment-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  padding: 0.75rem;
}

.attachment-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
}

.attachment-meta {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.9);
  margin: 0;
}

.attachment-remove {
  border: none;
  background: none;
  font-size: 0.75rem;
  color: #f97373;
}

.ocr-result-card {
  margin-top: 0.5rem;
}

.ocr-result-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.95);
  margin: 0 0 0.5rem 0;
}

/* Modal de câmera */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.2);
  width: clamp(280px, 92vw, 720px);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eef2f7;
}
.modal-title { font-size: 16px; font-weight: 700; }
.close-btn { border: none; background: transparent; font-size: 20px; cursor: pointer; }
.modal-body { padding: 1rem; }
.camera-video { width: 100%; aspect-ratio: 16 / 9; max-height: 60vh; border-radius: 8px; background: #000; object-fit: contain; }
.modal-actions { display: flex; gap: 0.75rem; padding: 0.75rem 1rem; border-top: 1px solid #eef2f7; }
.error-text { color: #b91c1c; font-size: 12px; margin-top: 0.5rem; }

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
.loading-box {
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(148,163,184,0.35);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .ocr-screen { --header-height: 72px; }
  .header-title { font-size: 20px; }
  .ocr-panels { grid-template-columns: 1fr 1fr; }
}
</style>
