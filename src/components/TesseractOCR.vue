<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center px-2">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <i class="fas fa-file-alt text-primary"></i>
        </div>
        Resultado do OCR
      </h2>
      <div class="flex gap-2">
        <button
          @click="copyTxt"
          :disabled="!ocrResult"
          class="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5"
          title="Copiar texto"
        >
          <i class="fas fa-copy"></i>
        </button>
        <button
          @click="downloadTxt"
          :disabled="!ocrResult"
          class="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5"
          title="Salvar como TXT"
        >
          <i class="fas fa-download"></i>
        </button>
      </div>
    </div>

    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
      <textarea
        v-model="ocrResult"
        placeholder="O texto reconhecido aparecerá aqui..."
        spellcheck="false"
        class="relative glass-input min-h-[200px] font-mono text-sm resize-y w-full focus:ring-2 focus:ring-primary/50 transition-all bg-black/40 border-white/10 rounded-xl p-4 text-white/90"
      ></textarea>
      <div class="absolute bottom-3 right-3 text-xs text-white/40 pointer-events-none bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
        {{ ocrResult.length }} caracteres
      </div>
    </div>

    <!-- Extracted Fields -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-2">
        <h3 class="text-base font-bold text-white/90 flex items-center gap-2">
          <i class="fas fa-magic text-secondary"></i>
          Dados Extraídos
        </h3>
        <span class="text-[10px] font-bold tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-full border border-secondary/20 uppercase">IA Powered</span>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="glass-card p-5 border-l-4 border-l-primary flex flex-col justify-between hover:bg-white/5 transition-colors group relative overflow-hidden">
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fas fa-building text-4xl text-primary"></i>
          </div>
          <label class="block text-xs font-bold text-white/50 uppercase mb-2 tracking-wider">
            CNPJ
          </label>
          <p class="font-mono font-medium text-white text-lg truncate relative z-10">
            {{ extractedFields.cnpj || '—' }}
          </p>
        </div>
        <div class="glass-card p-5 border-l-4 border-l-success flex flex-col justify-between hover:bg-white/5 transition-colors group relative overflow-hidden">
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fas fa-calendar-alt text-4xl text-success"></i>
          </div>
          <label class="block text-xs font-bold text-white/50 uppercase mb-2 tracking-wider">
            Data
          </label>
          <p class="font-mono font-medium text-white text-lg truncate relative z-10">
            {{ extractedFields.data || '—' }}
          </p>
        </div>
        <div class="glass-card p-5 border-l-4 border-l-warning flex flex-col justify-between hover:bg-white/5 transition-colors group relative overflow-hidden">
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fas fa-dollar-sign text-4xl text-warning"></i>
          </div>
          <label class="block text-xs font-bold text-white/50 uppercase mb-2 tracking-wider">
            Valor Total
          </label>
          <p class="font-mono font-bold text-white text-xl truncate relative z-10">
            {{ extractedFields.total ? 'R$ ' + extractedFields.total.toFixed(2) : '—' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 flex-wrap pt-2">
      <button
        @click="parseFields(ocrResult)"
        :disabled="!ocrResult"
        class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg"
      >
        <i class="fas fa-sync-alt text-primary"></i> Re-extrair
      </button>
      <button
        @click="showJson = !showJson"
        :disabled="!extractedFields.cnpj && !extractedFields.data && !extractedFields.total"
        class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg ml-auto"
      >
        <i class="fas fa-code text-secondary"></i> {{ showJson ? 'Ocultar' : 'Ver' }} JSON
      </button>
    </div>

    <!-- JSON Display -->
    <transition name="fade">
      <div v-if="showJson" class="glass-card p-0 overflow-hidden border border-white/10 animate-fade-in-up mt-4">
        <div class="bg-black/40 px-4 py-3 border-b border-white/5 flex justify-between items-center">
          <span class="text-xs font-mono text-white/60 uppercase tracking-wider">JSON Result</span>
          <button @click="copyJson" class="text-xs text-primary hover:text-white transition-colors font-medium hover:underline">Copiar</button>
        </div>
        <div class="p-4 bg-black/30 overflow-x-auto custom-scrollbar">
          <pre class="text-xs font-mono whitespace-pre text-blue-300/90">{{ getJson() }}</pre>
        </div>
      </div>
    </transition>
    
    <div class="mt-8 pt-4 border-t border-white/5">
      <button
        @click="confirmRegister"
        :disabled="!ocrResult || isProcessing || !lastBlob"
        class="gradient-btn w-full flex justify-center items-center gap-3 text-lg font-bold shadow-xl hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none py-4 transform hover:-translate-y-1 transition-all duration-300"
      >
        <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-check-circle"></i>
        <span>{{ isProcessing ? 'Processando...' : 'Confirmar Cadastro' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue';

const emit = defineEmits(['ocr-completed', 'ocr-progress']);

// Estados principais
const ocrStatus = ref('');
const ocrProgress = ref(0);
const ocrResult = ref('');
const extractedFields = reactive({
  cnpj: null,
  data: null,
  total: null,
});
const showJson = ref(false);
const isProcessing = ref(false);
const showPrompt = ref(false);
const lastBlob = ref(null);
const customPrompt = ref(`Você é um sistema corporativo que extrai dados estruturados de notas fiscais.

REGRAS IMPORTANTES:
- Retorne SOMENTE JSON válido.
- Nunca inclua explicações, texto ou comentários.
- Siga exatamente o schema abaixo.
- Campos ausentes = null.
Tarefa:
Classifique cada item da nota fiscal em uma categoria de gasto.

Instruções:
Leia a descrição do produto/serviço.
Quero que coloque os ultimos numeros do cartão, caso esteja disponível na nota fiscal/fatura.
Caso você identifique que seja uma fatura coloque em tipoGasto = Fatura.
Determine o tipo de gasto mais adequado com base no que foi comprado.
Sempre responda usando apenas o nome da categoria, sem explicações adicionais.
Caso a descrição seja ambígua, escolha a categoria mais provável.
CATEGORIZE CADA TIPO DE PRODUTO NA FATURA por favor.

Categorias permitidas:
Alimentação — refeições, lanches, restaurantes, bebida alcólica e mercados relacionados a comida.
Transporte — Uber, táxi, combustível, passagens.
Saúde — medicamentos, farmácia, exames.
Educação — cursos, mensalidades, material escolar.
Lazer — cinema, jogos, eventos, bares.
Compras — roupas, eletrônicos, acessórios.
Serviços — manutenção, consertos, serviços gerais.
Moradia — aluguel, contas residenciais, móveis.
Outros — qualquer item que não se encaixe nas categorias acima.

Formato de resposta:
Retorne um JSON no formato:
{
  "descricao": "<texto do item>",
  "categoria": "<categoria>"
}

SCHEMA:
{
  "numeroCartao": number|null,
  "valorTotal": number|null,
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
  // Simples alert por enquanto, pode ser substituído por um toast real
  alert(`${title}\n${description}`);
}

function copyJson() {
  if (!extractedFields.cnpj && !extractedFields.data && !extractedFields.total) {
    showToast('JSON Vazio', 'Não há dados extraídos para copiar.', 'error');
    return;
  }
  const jsonStr = getJson();
  navigator.clipboard.writeText(jsonStr)
    .then(() => showToast('Copiado!', 'JSON copiado para a área de transferência.'))
    .catch(err => showToast('Erro', 'Falha ao copiar JSON.', 'error'));
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
  } catch (err) {
    showToast('Erro ao salvar', err.message || 'Falha ao confirmar cadastro', 'error');
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
