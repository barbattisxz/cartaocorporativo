
import pdfParse from 'pdf-parse';
import * as pdfParseAll from 'pdf-parse';

console.log('Default export:', typeof pdfParse);
console.log('All exports keys:', Object.keys(pdfParseAll));
if (typeof pdfParse === 'object') {
    console.log('Default keys:', Object.keys(pdfParse));
}
