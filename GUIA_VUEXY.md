# Guia de Uso do Vuexy no Projeto OCR

Este guia explica como utilizar e estender os componentes e estilos do Vuexy no projeto OCR.

## Índice
1. [Estrutura do Vuexy](#estrutura-do-vuexy)
2. [Componentes Básicos](#componentes-básicos)
3. [Sistema de Grid](#sistema-de-grid)
4. [Estilização](#estilização)
5. [Ícones](#ícones)
6. [Criando Novos Componentes](#criando-novos-componentes)

## Estrutura do Vuexy

O Vuexy está organizado na pasta `src/vuexy` com a seguinte estrutura:

```
src/vuexy/
├── @core/
├── @layouts/
├── assets/
│   ├── styles/
│   │   └── styles.scss
├── components/
├── composables/
├── layouts/
├── navigation/
├── pages/
├── plugins/
├── utils/
└── views/
```

### Principais Diretórios

- **assets/styles**: Contém os arquivos SCSS para estilização
- **components**: Componentes reutilizáveis do Vuexy
- **layouts**: Layouts pré-definidos para diferentes tipos de páginas

## Componentes Básicos

### Cards

Os cards são um elemento fundamental do Vuexy:

```html
<div class="card">
  <div class="card-header">
    <h4 class="card-title">Título do Card</h4>
  </div>
  <div class="card-body">
    Conteúdo do card
  </div>
  <div class="card-footer">
    Rodapé do card
  </div>
</div>
```

### Botões

Vuexy utiliza as classes do Bootstrap para botões com estilos aprimorados:

```html
<!-- Botão primário -->
<button class="btn btn-primary">Botão Primário</button>

<!-- Botão outline -->
<button class="btn btn-outline-secondary">Botão Outline</button>

<!-- Botão com ícone -->
<button class="btn btn-success">
  <i class="fas fa-check me-1"></i> Confirmar
</button>

<!-- Botão pequeno -->
<button class="btn btn-info btn-sm">Botão Pequeno</button>
```

### Alertas

```html
<div class="alert alert-primary">
  Este é um alerta primário
</div>

<div class="alert alert-danger d-flex align-items-center">
  <i class="fas fa-exclamation-triangle me-2"></i>
  Este é um alerta de erro com ícone
</div>
```

## Sistema de Grid

O Vuexy utiliza o sistema de grid do Bootstrap:

```html
<div class="row">
  <!-- Coluna que ocupa metade da largura em telas médias e maiores -->
  <div class="col-12 col-md-6">
    Conteúdo da primeira coluna
  </div>
  
  <!-- Coluna que ocupa metade da largura em telas médias e maiores -->
  <div class="col-12 col-md-6">
    Conteúdo da segunda coluna
  </div>
</div>
```

### Classes Responsivas

- `col-12`: Ocupa 100% da largura em todas as telas
- `col-md-6`: Ocupa 50% da largura em telas médias (≥768px)
- `col-lg-4`: Ocupa 33% da largura em telas grandes (≥992px)

## Estilização

### Cores do Tema

O Vuexy define várias classes de cores que você pode usar:

```html
<!-- Texto colorido -->
<p class="text-primary">Texto primário</p>
<p class="text-success">Texto de sucesso</p>
<p class="text-danger">Texto de erro</p>

<!-- Backgrounds coloridos -->
<div class="bg-primary text-white p-2">Background primário</div>
<div class="bg-light p-2">Background claro</div>
```

### Espaçamento

O Vuexy segue as convenções de espaçamento do Bootstrap:

```html
<!-- Margens -->
<div class="mt-3">Margem superior</div>
<div class="mb-4">Margem inferior</div>
<div class="ms-2">Margem esquerda</div>
<div class="me-2">Margem direita</div>

<!-- Padding -->
<div class="p-3">Padding em todos os lados</div>
<div class="py-2">Padding vertical</div>
<div class="px-4">Padding horizontal</div>
```

## Ícones

O projeto utiliza o Font Awesome para ícones:

```html
<!-- Ícones básicos -->
<i class="fas fa-user"></i>
<i class="fas fa-home"></i>
<i class="fas fa-cog"></i>

<!-- Ícones com tamanhos diferentes -->
<i class="fas fa-star fa-xs"></i>
<i class="fas fa-star fa-sm"></i>
<i class="fas fa-star"></i>
<i class="fas fa-star fa-lg"></i>
<i class="fas fa-star fa-2x"></i>
```

## Criando Novos Componentes

Para criar novos componentes com o estilo Vuexy:

1. Crie um novo arquivo `.vue` na pasta `components`
2. Importe os estilos necessários
3. Use as classes e componentes do Vuexy/Bootstrap

Exemplo de um novo componente:

```vue
<template>
  <div class="card">
    <div class="card-header">
      <h4 class="card-title">{{ title }}</h4>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
```

## Personalizando Estilos

Para personalizar os estilos do Vuexy, você pode editar o arquivo `src/vuexy/assets/styles/styles.scss` ou criar um novo arquivo SCSS e importá-lo no `main.ts`.

Exemplo de personalização:

```scss
// Arquivo: src/assets/custom-styles.scss

// Sobrescrever variáveis do Bootstrap
$primary: #3f51b5;
$secondary: #ff4081;

// Importar Bootstrap após definir as variáveis
@import 'bootstrap/scss/bootstrap';

// Estilos personalizados
.card {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

Depois, importe este arquivo no `main.ts`:

```typescript
// main.ts
import './assets/custom-styles.scss';
```

---

## Dicas e Boas Práticas

1. **Mantenha a consistência**: Use sempre os mesmos componentes e estilos para elementos similares
2. **Aproveite os componentes existentes**: Antes de criar um novo componente, verifique se já existe algo similar no Vuexy
3. **Responsividade**: Sempre projete pensando em dispositivos móveis primeiro (mobile-first)
4. **Documentação**: Consulte a documentação do Bootstrap para mais detalhes sobre classes e componentes

---

*Este guia cobre apenas os conceitos básicos do Vuexy. Para informações mais detalhadas, consulte a documentação oficial do Vuexy e do Bootstrap.*