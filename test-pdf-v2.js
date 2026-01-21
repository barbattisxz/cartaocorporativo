
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { PDFParse } = require('pdf-parse');

const pdfHeader = Buffer.from('%PDF-1.4\n%\n'); 

async function test() {
    try {
        console.log('Tentando new PDFParse({ data: buffer })');
        const parser = new PDFParse({ data: pdfHeader });
        console.log('Parser criado com sucesso.');
        
        // Tentar obter texto (vai falhar pois o PDF é incompleto, mas quero ver se chega lá)
        try {
            const text = await parser.getText();
            console.log('Texto:', text);
        } catch (e) {
            console.log('Erro ao extrair texto (esperado para buffer inválido):', e.message);
        }
        
    } catch (e) {
        console.error('Erro na criação do parser:', e);
    }
}

test();
