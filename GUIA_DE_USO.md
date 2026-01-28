# Guia de Uso - OCR de Notas Fiscais

Este guia explica como utilizar o aplicativo OCR de Notas Fiscais com interface Vuexy.

## Índice
1. [Visão Geral](#visão-geral)
2. [Modos de Entrada](#modos-de-entrada)
3. [Processamento de Imagens](#processamento-de-imagens)
4. [Resultados do OCR](#resultados-do-ocr)
5. [Campos Extraídos](#campos-extraídos)

## Visão Geral

O aplicativo OCR de Notas Fiscais permite digitalizar e extrair informações de notas fiscais usando reconhecimento óptico de caracteres (OCR). A interface foi desenvolvida com o estilo Vuexy para uma experiência de usuário moderna e intuitiva.

## Modos de Entrada

### Upload de Arquivo
1. Clique no botão **Upload** na parte superior da aplicação
2. Clique em **Escolher Arquivo** ou arraste uma imagem para a área designada
3. A imagem será carregada e exibida na tela

### Webcam
1. Clique no botão **Webcam** na parte superior da aplicação
2. Clique em **Iniciar Webcam** para ativar a câmera
3. Posicione a nota fiscal em frente à câmera
4. Clique em **Capturar** para tirar uma foto
5. Use o botão **Parar** para desativar a webcam quando terminar

### Exemplo
- Clique no botão **Exemplo** para carregar uma imagem de exemplo de nota fiscal

## Processamento de Imagens

### Pré-processamento
- Marque a opção **Pré-processar** para melhorar a qualidade da imagem antes do OCR
- Esta opção ajusta automaticamente o contraste e aplica filtros para melhorar a legibilidade do texto

### Detecção Automática
O sistema utiliza o modelo YOLO para detectar automaticamente a área da nota fiscal na imagem, melhorando a precisão do OCR.

## Resultados do OCR

Após o processamento da imagem, o texto extraído será exibido no painel direito da aplicação.

### Opções de Resultado
- **Copiar**: Copia todo o texto extraído para a área de transferência
- **Salvar TXT**: Baixa o texto extraído como um arquivo .txt

## Campos Extraídos

O sistema extrai automaticamente informações importantes da nota fiscal:

- **CNPJ**: Número de identificação da empresa
- **Data**: Data de emissão da nota fiscal
- **Valor Total**: Valor total da nota fiscal

Estes campos são exibidos em cartões coloridos abaixo da área de texto para fácil visualização.

---

## Dicas de Uso

1. **Para melhores resultados**:
   - Use imagens bem iluminadas e nítidas
   - Certifique-se de que a nota fiscal esteja completamente visível
   - Ative a opção de pré-processamento para imagens de baixa qualidade

2. **Solução de problemas**:
   - Se a webcam não iniciar, verifique as permissões do navegador
   - Se o OCR não reconhecer corretamente o texto, tente ajustar a posição da nota fiscal ou use uma imagem com melhor iluminação

---

*Este aplicativo utiliza Tesseract.js para OCR e YOLOv5 para detecção de objetos.*