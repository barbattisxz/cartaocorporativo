<template>
  <div>
    <!-- Webcam/Image Input Section -->
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="form-label fw-bold">
          Imagem/Arquivo da Nota Fiscal
        </label>
        <div class="form-check form-check-inline">
          <input
            id="chk-pre"
            type="checkbox"
            v-model="preprocessImage"
            class="form-check-input"
          />
          <label for="chk-pre" class="form-check-label">Pré-processar</label>
        </div>
      </div>

      <div class="position-relative border rounded bg-light p-1" style="min-height: 300px;">
        <input
          ref="fileInput"
          type="file"
          accept="image/*,.txt"
          @change="onFileChange"
          class="d-none"
        />

        <!-- Upload Mode with Image -->
        <img
          v-if="mode === 'upload' && imageUrl"
          ref="imgRef"
          :src="imageUrl"
          alt="Pré-visualização"
          class="img-fluid mx-auto d-block"
          style="max-height: 300px;"
        />

        

        <!-- Empty State -->
        <div
          v-else
          class="text-center p-4 text-muted"
        >
          <i class="fas fa-file-alt fa-3x mb-3"></i>
          <p class="mb-3">Carregue uma imagem ou arquivo TXT</p>
          <button
            @click="$refs.fileInput.click()"
            class="btn btn-primary"
          >
            <i class="fas fa-upload me-1"></i> Escolher Arquivo
          </button>
        </div>

        <!-- Floating Upload Button -->
        <button
          v-if="mode === 'upload' && imageUrl"
          @click="$refs.fileInput.click()"
          class="position-absolute top-0 end-0 m-2 btn btn-light btn-sm"
        >
          <i class="fas fa-upload"></i>
        </button>

        
      </div>

      
    </div>
    
    <!-- Canvas para processamento (hidden) -->
    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>

<script setup>
import { ref, onUnmounted, defineEmits } from 'vue';

const emit = defineEmits(['image-captured', 'text-loaded', 'processing-status']);

// Estados principais
const imageUrl = ref('');
const mode = ref('upload');
const webcamActive = ref(false);
const webcamError = ref('');
const preprocessImage = ref(false);
const currentBlob = ref(null);
const isProcessing = ref(false);

// refs DOM
const imgRef = ref(null);
const canvasRef = ref(null);
const videoRef = ref(null);
const fileInput = ref(null);
let streamRef = null;

// Cleanup ao desmontar
onUnmounted(() => {
  stopWebcam();
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
});

// Helpers
function stopWebcam() {
  if (streamRef) {
    streamRef.getTracks().forEach((t) => t.stop());
    streamRef = null;
  }
  webcamActive.value = false;
}

function setPreview(file) {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
  currentBlob.value = file;
  const url = URL.createObjectURL(file);
  imageUrl.value = url;
  emit('processing-status', false);
}

function showToast(title, description, type = 'info') {
  alert(`${title}\n${description}`);
}

function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      if (text) {
        emit('text-loaded', text);
        showToast('Arquivo TXT carregado', 'Texto extraído com sucesso do arquivo');
      }
    };
    reader.readAsText(file);
    return;
  }

  if (file.type.startsWith('image/')) {
    setPreview(file);
    mode.value = 'upload';
    stopWebcam();
    // Processa automaticamente após selecionar a imagem
    captureImage();
  } else {
    showToast('Formato não suportado', 'Por favor, selecione uma imagem (PNG, JPG, etc.) ou arquivo TXT.', 'error');
  }
}

async function startWebcam() {
  try {
    webcamError.value = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Seu navegador não suporta acesso à câmera');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        facingMode: 'environment',
      },
    });
    streamRef = stream;
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.onloadedmetadata = () => {
        webcamActive.value = true;
        emit('processing-status', false);
        showToast('Webcam ativa', 'Câmera inicializada com sucesso');
      };
    }
  } catch (err) {
    console.error('Erro na webcam:', err);
    webcamError.value = err.message;
    showToast('Erro na webcam', err.message || 'Não foi possível acessar a câmera.', 'error');
    stopWebcam();
  }
}

function downloadImage(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Imagem salva!', 'Captura baixada com sucesso.');
}

async function preprocessIfNeeded() {
  if (!preprocessImage.value || !currentBlob.value) return currentBlob.value;

  return new Promise((resolve) => {
    const url = URL.createObjectURL(currentBlob.value);
    const image = new Image();
    image.onload = () => {
      const maxW = 1600;
      const ratio = Math.min(1, maxW / image.width);
      const w = Math.round(image.width * ratio);
      const h = Math.round(image.height * ratio);
      const canvas = canvasRef.value;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      ctx.filter = 'contrast(1.2) brightness(1.1)';
      ctx.drawImage(image, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) {
        const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        sum += y;
      }
      const mean = sum / (d.length / 4);

      for (let i = 0; i < d.length; i += 4) {
        const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const v = y > mean * 0.9 ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob(
        (b) => {
          if (b) currentBlob.value = b;
          resolve(b);
          URL.revokeObjectURL(url);
        },
        'image/png',
        1
      );
    };
    image.src = url;
  });
}

async function captureImage() {
  if (!currentBlob.value && mode.value !== 'webcam') {
    showToast('Erro', 'Nenhuma imagem selecionada.', 'error');
    return;
  }

  let blobToProcess = currentBlob.value;
  isProcessing.value = true;
  emit('processing-status', true);

  if (mode.value === 'webcam' && videoRef.value) {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    const video = videoRef.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    blobToProcess = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
    });
    currentBlob.value = blobToProcess;
  }

  if (!blobToProcess) {
    showToast('Erro', 'Não foi possível capturar a imagem.', 'error');
    isProcessing.value = false;
    emit('processing-status', false);
    return;
  }

  // Auto-capturar imagem
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode.value === 'upload' && imgRef.value) {
        canvas.width = imgRef.value.naturalWidth;
        canvas.height = imgRef.value.naturalHeight;
        ctx.drawImage(imgRef.value, 0, 0, canvas.width, canvas.height);
      } else if (mode.value === 'webcam' && videoRef.value) {
        const video = videoRef.value;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const dataUrl = canvas.toDataURL('image/png');
      downloadImage(dataUrl, 'captura-ocr-auto.png');
    }
  }

  try {
    const blob = await preprocessIfNeeded();
    emit('image-captured', blob);
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    showToast('Erro', err.message || 'Falha ao processar a imagem', 'error');
  } finally {
    isProcessing.value = false;
    emit('processing-status', false);
  }
}

// Métodos expostos
defineExpose({
  setMode: (newMode) => {
    mode.value = newMode;
    if (newMode === 'webcam') {
      imageUrl.value = '';
      currentBlob.value = null;
    } else {
      stopWebcam();
    }
  },
  startWebcam,
  captureImage,
  triggerFileSelect: () => {
    const el = fileInput.value;
    if (el) {
      el.click();
    }
  },
});
</script>