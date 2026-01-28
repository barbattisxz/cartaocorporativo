<template>
  <div class="mb-3">
    <div class="result-container">
      <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
      <div class="result-grid">
        <div class="glass-card">
          <label class="field-label">CNPJ</label>
          <p class="field-text">{{ extractedFields.cnpj || '—' }}</p>
        </div>
        <div class="glass-card">
          <label class="field-label">Data</label>
          <p class="field-text">{{ extractedFields.data || '—' }}</p>
        </div>
        <div class="glass-card">
          <label class="field-label">Valor Total</label>
          <p class="field-text">
            {{ extractedFields.total != null ? extractedFields.total.toFixed(2) : '—' }}
          </p>
        </div>
      </div>
      <div class="actions">
        <button
          @click="confirmRegister"
          :disabled="!ocrResult || isProcessing || !lastBlob"
          class="primary-btn"
        >
          Carregar cadastro
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['ocr-completed', 'ocr-progress']);
const router = useRouter();

// Estados principais
const ocrStatus = ref('');
const ocrProgress = ref(0);
const ocrResult = ref('');
const errorMessage = ref('');
const extractedFields = reactive({
  cnpj: null,
  data: null,
  total: null,
});
const showJson = ref(false);
const isProcessing = ref(false);
const showPrompt = ref(false);
const lastBlob = ref(null);
const customPrompt = ref(`Você é um sistema corporativo que extrai dados estruturados de notas fiscais e faturas.

REGRAS IMPORTANTES:
- Retorne SOMENTE JSON válido.
- Nunca inclua explicações, texto ou comentários.
- Siga exatamente o schema abaixo.
- Campos ausentes = null.

Tarefa:
1. Extraia TODOS os itens da nota/fatura.
2. Identifique o VALOR TOTAL. Se não houver campo explícito de total, CALCULE A SOMA dos itens e use como valorTotal.
3. Classifique cada item em uma categoria de gasto.
4. Se for uma fatura de cartão, defina tipoGasto = 'Fatura'.

Instruções:
- Leia a descrição do produto/serviço.
- Quero que coloque os ultimos numeros do cartão, caso esteja disponível na nota fiscal/fatura.
- Determine o tipo de gasto mais adequado com base no que foi comprado.
- Sempre responda usando apenas o nome da categoria, sem explicações adicionais.
- Caso a descrição seja ambígua, escolha a categoria mais provável.
- CATEGORIZE CADA TIPO DE PRODUTO NA FATURA por favor.

Categorias permitidas:
Alimentação, Transporte, Saúde, Educação, Lazer, Compras, Serviços, Moradia, Outros.

Formato de resposta:
Retorne um JSON no formato:
{
  "descricao": "<texto do item>",
  "categoria": "<categoria>"
}

SCHEMA:
{
  "numeroCartao": number|null,
  "valorTotal": number (Obrigatório. Se não encontrar, SOMA dos itens),
  "data": "string|null",
  "tipoGasto": "string|null",
  "estabelecimento": "string|null",
  "itens": [
    {
      "descricao": "string|null",
      "quantidade": number|null,
      "valor": number|null
    }
  ]
}`);

function showToast(title, description, type = 'info') {
  console.log(`[${type}] ${title} - ${description}`);
}

function copyTxt() {
  if (!ocrResult.value) {
    showToast('Nenhum texto', 'Não há texto para copiar.', 'error');
    return;
  }

  navigator.clipboard
    .writeText(ocrResult.value)
    .then(() => {
      showToast('Copiado!', 'Texto copiado para a área de transferência.');
    })
    .catch((err) => {
      console.error('Erro ao copiar:', err);
      showToast('Erro ao copiar', 'Não foi possível copiar o texto.', 'error');
    });
}

function downloadTxt() {
  if (!ocrResult.value) {
    showToast('Nenhum texto', 'Não há texto para baixar.', 'error');
    return;
  }

  const blob = new Blob([ocrResult.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ocr-nota-fiscal.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Arquivo salvo!', 'Texto salvo como TXT com sucesso.');
}

function getJson() {
  return JSON.stringify(extractedFields, null, 2);
}

function parseFields(text) {
  if (!text) {
    extractedFields.cnpj = extractedFields.data = extractedFields.total = null;
    return;
  }

  // Tenta primeiro interpretar como JSON do backend
  try {
    const parsed = JSON.parse(text);
    extractedFields.data = parsed?.data || null;
    extractedFields.total = typeof parsed?.valorTotal === 'number' ? parsed.valorTotal : null;
    // CNPJ não está presente no schema do backend; mantém valor atual ou null
    extractedFields.cnpj = extractedFields.cnpj || null;
    return;
  } catch (e) {
    // segue com heurísticas em texto puro
  }

  const txt = text.replace(/[\t\r]+/g, ' ').replace(/\s{2,}/g, ' ').toUpperCase();

  const mCNPJ =
    txt.match(/\b(\d{2}[\.\/-]?\d{3}[\.\/-]?\d{3}[\.\/-]?\d{4}[\.\/-]?\d{2})\b/) ||
    txt.match(/CNPJ[:\s]*(\d{2}[\.\/-]?\d{3}[\.\/-]?\d{3}[\.\/-]?\d{4}[\.\/-]?\d{2})/);

  const mData =
    txt.match(/\b(\d{1,2}[\-\/]\d{1,2}[\-\/]\d{4})\b/) ||
    txt.match(/DATA[:\s]*(\d{1,2}[\-\/]\d{1,2}[\-\/]\d{4})/);

  const mTotal = txt.match(
    /(TOTAL|VALOR\s*TOTAL|VALOR\s*A\s*PAGAR|TOTAL\s*A\s*PAGAR|VALOR\s*LIQUIDO)[^\d]*(\d{1,3}(?:[\.\,]\d{3})*[\.\,]\d{2})/
  );

  let cnpj = null;
  let data = null;
  let total = null;

  if (mCNPJ) {
    cnpj = mCNPJ[1] || mCNPJ[2] || mCNPJ[0];
    cnpj = cnpj.replace(/[\.\/-]/g, '');
    if (cnpj.length === 14) {
      cnpj = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    }
  }

  if (mData) {
    data = mData[1] || mData[2] || mData[0];
  }

  if (mTotal) {
    const totalStr = mTotal[2];
    if (totalStr) {
      let cleanTotal = totalStr.replace(/\./g, '').replace(',', '.');
      const parsedTotal = parseFloat(cleanTotal);
      if (!isNaN(parsedTotal)) {
        total = parsedTotal;
      }
    }
  }

  extractedFields.cnpj = cnpj;
  extractedFields.data = data;
  extractedFields.total = total;
}

async function runOCR(blob) {
  if (!blob) {
    showToast('Erro', 'Nenhuma imagem/arquivo para processar.', 'error');
    return;
  }

  ocrStatus.value = 'Enviando para processamento...';
  ocrProgress.value = 0;
  isProcessing.value = true;
  emit('ocr-progress', 0);

  try {
    let fileToSend;
    if (blob instanceof File) {
      fileToSend = blob;
    } else {
      const type = blob.type || 'image/png';
      fileToSend = new File([blob], 'captura.png', { type });
    }

    const form = new FormData();
    form.append('file', fileToSend);
    if (customPrompt.value && customPrompt.value.trim().length > 0) {
      form.append('prompt', customPrompt.value);
    }
    form.append('confirm', '0');

    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const resp = await fetch('http://localhost:5175/api/ocr', {
      method: 'POST',
      headers,
      body: form,
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Falha no servidor: ${resp.status} ${errText}`);
    }
    const json = await resp.json();

    const jsonText = JSON.stringify(json, null, 2);
    ocrResult.value = jsonText;
    parseFields(jsonText);
    lastBlob.value = fileToSend;
    errorMessage.value = '';

    emit('ocr-completed', {
      text: jsonText,
      confidence: null,
      fields: { ...extractedFields }
    });

    showToast('OCR concluído', 'Dados estruturados extraídos com sucesso.');
    return jsonText;
  } catch (err) {
    console.error('Erro no OCR OpenAI:', err);
    ocrStatus.value = 'Erro no processamento: ' + (err.message || err);
    showToast('Erro no OCR', err.message || 'Falha ao processar o arquivo', 'error');
    errorMessage.value = err.message || 'Não foi possível ler a nota. Tente novamente.';
    throw err;
  } finally {
    isProcessing.value = false;
    ocrProgress.value = 0;
    emit('ocr-progress', 0);
  }
}

async function confirmRegister() {
  if (!lastBlob.value) return;
  isProcessing.value = true;
  try {
    const form = new FormData();
    form.append('file', lastBlob.value);
    if (customPrompt.value && customPrompt.value.trim().length > 0) {
      form.append('prompt', customPrompt.value);
    }
    form.append('confirm', '1');
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const resp = await fetch('http://localhost:5175/api/ocr', {
      method: 'POST',
      headers,
      body: form,
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Falha no servidor: ${resp.status} ${errText}`);
    }
    const json = await resp.json();
    const jsonText = JSON.stringify(json, null, 2);
    ocrResult.value = jsonText;
    parseFields(jsonText);
    showToast('Cadastro confirmado', 'Registro salvo com sucesso.');
    errorMessage.value = '';
    router.push({ name: 'home' });
  } catch (err) {
    showToast('Erro ao salvar', err.message || 'Falha ao confirmar cadastro', 'error');
    errorMessage.value = err.message || 'Falha ao confirmar cadastro.';
  } finally {
    isProcessing.value = false;
  }
}

// Métodos expostos
defineExpose({
  runOCR,
  parseFields,
  setOcrResult: (text) => {
    ocrResult.value = text;
    parseFields(text);
  }
});
</script>

<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.error-banner {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.45);
  color: #fecaca;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.85rem;
}
.result-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}
.glass-card {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  backdrop-filter: blur(10px);
  padding: 0.75rem;
}
.field-label {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.9);
  margin-bottom: 0.25rem;
  display: block;
}
.field-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}
.actions {
  display: flex;
  margin-top: 0.25rem;
}
.primary-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(to right, #2563eb, #8b5cf6);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
