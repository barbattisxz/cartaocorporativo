
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdfParse = require('pdf-parse');
    console.log('Modulo pdf-parse carregado com sucesso.');
    console.log('Tipo:', typeof pdfParse);
} catch (e) {
    console.error('Erro ao carregar pdf-parse:', e);
}
