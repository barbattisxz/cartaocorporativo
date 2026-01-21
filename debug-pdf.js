
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdfParse = require('pdf-parse');
    console.log('Tipo:', typeof pdfParse);
    console.log('Chaves:', Object.keys(pdfParse));
    console.log('É default function?', typeof pdfParse.default);
} catch (e) {
    console.error('Erro:', e);
}
