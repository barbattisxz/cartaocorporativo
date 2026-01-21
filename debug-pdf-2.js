
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const lib = require('pdf-parse');
    console.log('Tipo de lib.PDFParse:', typeof lib.PDFParse);
    // Tenta instanciar ou chamar
    try {
        const instance = new lib.PDFParse();
        console.log('Instância criada com sucesso');
    } catch(e) { console.log('Não é construtor:', e.message); }
} catch (e) {
    console.error('Erro:', e);
}
