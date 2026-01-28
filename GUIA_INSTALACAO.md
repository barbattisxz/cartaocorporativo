# Manual Completo de Instalação e Tecnologias

Este documento fornece uma visão detalhada de todas as tecnologias utilizadas no projeto e um guia passo-a-passo para configuração do ambiente de desenvolvimento.

## 1. Visão Geral das Tecnologias

O projeto é dividido em duas partes principais: **Frontend (Interface)** e **Backend (API)**.

### 📦 Dependências do Projeto (Bibliotecas)

Abaixo estão listadas todas as bibliotecas instaladas e suas funções no sistema.

#### Frontend (Interface do Usuário)
*   **`vue` (^3.5.21)**: O framework JavaScript progressivo utilizado para construir a interface.
*   **`vuetify` (^3.10.11)**: Biblioteca de componentes de UI baseada no Material Design para Vue. Fornece botões, cards, inputs e layouts prontos.
*   **`vue-router` (^4.6.3)**: Gerenciador de rotas oficial do Vue.js, permite navegação entre páginas (Home, Login, etc.) sem recarregar o navegador.
*   **`bootstrap` (^5.3.8)** & **`bootstrap-vue-3` (^0.5.1)**: Framework CSS popular para layouts responsivos e componentes adicionais.
*   **`@popperjs/core` (^2.11.8)**: Dependência necessária para o posicionamento de tooltips e popovers do Bootstrap.
*   **`sass` (^1.93.2)** & **`sass-loader` (^16.0.5)**: Pré-processador CSS que permite usar variáveis, aninhamento e mixins nos estilos.

#### OCR e Inteligência Artificial
*   **`tesseract.js` (^6.0.1)**: Biblioteca de OCR (Reconhecimento Óptico de Caracteres) pura em JavaScript. Permite extrair texto de imagens diretamente no navegador.
*   **`openai` (^4.55.0)**: Cliente oficial para conectar com a API da OpenAI (GPT-4o/GPT-3.5). Usada no backend para processar e estruturar os dados extraídos das notas fiscais.

#### Backend (Servidor API)
*   **`express` (^4.19.2)**: Framework web rápido e minimalista para Node.js. Gerencia as rotas da API (ex: `/api/ocr`).
*   **`multer` (^1.4.5-lts.1)**: Middleware para Node.js que lida com `multipart/form-data`, essencial para permitir o **upload de arquivos** (imagens/PDFs) para o servidor.
*   **`cors` (^2.8.5)**: (Cross-Origin Resource Sharing) Permite que o Frontend (porta 55173) se comunique com o Backend (porta 5175) sem bloqueios de segurança do navegador.
*   **`dotenv` (^16.4.5)**: Carrega variáveis de ambiente de um arquivo `.env` para `process.env`. Usado para proteger a chave da API (`OPENAI_API_KEY`).

#### Ferramentas de Desenvolvimento e Build
*   **`vite` (^7.1.7)**: Ferramenta de build de próxima geração. Inicia o servidor de desenvolvimento extremamente rápido.
*   **`typescript` (~5.8.3)**: Adiciona tipagem estática ao JavaScript, melhorando a segurança e a manutenção do código.
*   **`concurrently` (^9.0.1)**: Permite rodar múltiplos comandos ao mesmo tempo. Usado aqui para rodar o Frontend e o Backend com um único comando (`npm run dev:all`).
*   **`vite-plugin-pwa` (^1.0.3)**: Plugin para transformar o site em um PWA (Progressive Web App), permitindo instalação no desktop/mobile e funcionamento offline.
*   **`vue-tsc` (^3.0.7)**: Compilador TypeScript para arquivos Vue.

---

## 2. Guia de Instalação Passo-a-Passo

Siga estes passos para configurar o projeto do zero em uma nova máquina.

### Passo 1: Instalar Pré-requisitos
Certifique-se de ter instalado:
1.  **Node.js** (Versão LTS recomendada, v18 ou superior).
    *   Verifique com: `node -v`
2.  **Git** (Opcional, para clonar o repositório).

### Passo 2: Baixar o Projeto
Se você baixou o arquivo zip, extraia-o. Se estiver usando git:
```bash
git clone <url-do-repositorio>
cd Ocr
```

### Passo 3: Instalar Dependências
Abra o terminal na pasta raiz do projeto (`.../Ocr`) e execute:

```bash
npm install
```
*Isso lerá o arquivo `package.json` e baixará todas as bibliotecas listadas acima para a pasta `node_modules`.*

### Passo 4: Configurar Variáveis de Ambiente
O sistema precisa de uma chave da OpenAI para funcionar.

1.  Crie um arquivo chamado `.env` na raiz do projeto (se não existir).
2.  Adicione o seguinte conteúdo:

```env
OPENAI_API_KEY="sua-chave-aqui-sk-proj-..."
PORT=5175
```
*Substitua o valor pela sua chave real da OpenAI.*

### Passo 5: Executar o Projeto
Para iniciar tudo (Frontend + Backend) de uma vez:

```bash
npm run dev:all
```

O terminal mostrará dois endereços:
1.  **Backend (API)**: `http://localhost:5175` (Gerencia uploads e IA)
2.  **Frontend (App)**: `http://localhost:55173` (Acesse este no navegador)

---

## 3. Comandos Disponíveis

No arquivo `package.json`, temos os seguintes scripts configurados:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia apenas o servidor Frontend (Vite). |
| `npm run server` | Inicia apenas o servidor Backend (Node.js/Express). |
| `npm run dev:all` | **Recomendado**. Inicia Frontend e Backend simultaneamente. |
| `npm run build` | Compila o projeto para produção (gera pasta `dist`). |
| `npm run preview` | Visualiza a versão de produção localmente após o build. |

## 4. Estrutura de Pastas Importantes

*   `/server`: Código do backend (API Node.js).
    *   `index.js`: Ponto de entrada do servidor.
*   `/src`: Código do frontend (Vue.js).
    *   `/components`: Componentes reutilizáveis (ex: `ocr.vue`).
    *   `/pages`: Telas da aplicação.
*   `/public`: Arquivos estáticos (ícones, imagens).
