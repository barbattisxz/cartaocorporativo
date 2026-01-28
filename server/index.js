import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { PDFParse } from 'pdf-parse';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json()); // Importante para ler JSON no body

// Inicializa Prisma Client
const prisma = new PrismaClient();

// Chave secreta JWT (idealmente no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_key_123';

// Garantir diretórios de armazenamento
const storageDir = path.resolve('./storage');
const imagesDir = path.join(storageDir, 'images');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const upload = multer({ dest: path.resolve('./tmp') });

// --- MIDDLEWARES ---

// Middleware de Autenticação (Opcional por enquanto, mas recomendado)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, login, email, senha } = req.body;

    if (!nome || !login || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await prisma.beneficiario.findFirst({
      where: {
        OR: [{ login }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Login ou email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.beneficiario.create({
      data: {
        nome,
        login,
        email,
        senha: hashedPassword
      }
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: user.id_beneficiario });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { loginOrEmail, senha } = req.body;

    const user = await prisma.beneficiario.findFirst({
      where: {
        OR: [
          { login: loginOrEmail },
          { email: loginOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(400).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: user.id_beneficiario, login: user.login, nome: user.nome },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id_beneficiario, 
        nome: user.nome, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});


// --- ROTAS OCR ---

function buildPrompt() {
  const today = new Date().toISOString().split('T')[0];
  return `
Você é um sistema especialista em extração de dados de faturas de cartão de crédito e notas fiscais.
Data de hoje para referência: ${today}.

TAREFA CRÍTICA:
1. Extraia TODOS os itens individuais listados no documento (transações, compras, lançamentos).
2. IDENTIFIQUE O VALOR TOTAL DA FATURA. Se não houver um campo explícito "Total" ou "Valor a Pagar", VOCÊ DEVE SOMAR OS VALORES DE TODOS OS ITENS EXTRAÍDOS e usar essa soma como valorTotal.
3. Se for uma fatura de cartão (ex: Nubank, Itau, Bradesco, Santander), liste cada transação individualmente (data, estabelecimento, valor) e defina tipoGasto='Fatura'.

ATENÇÃO:
- Se o documento tiver múltiplos itens com datas diferentes, É UMA FATURA.
- Se o emissor for "Nu Pagamentos", "Nubank", ou bancos similares, É UMA FATURA.

REGRAS:
- Retorne SOMENTE JSON válido.
- Schema RÍGIDO.
- Campos ausentes = null.
- Data: Converta datas como "21 OUT" ou "02 NOV" para o formato "YYYY-MM-DD" usando o ano corrente ou o ano da fatura.
- Valores monetários: Retorne sempre como NUMBER (float), nunca string (ex: 360.80).

SCHEMA:
{
  "numeroCartao": "string|null (últimos 4 dígitos)",
  "valorTotal": number (Obrigatório. Se não encontrar, SOMA dos itens),
  "data": "string|null (data de emissão ou vencimento YYYY-MM-DD)",
  "tipoGasto": "string (Se for fatura de cartão, use 'Fatura'. Se for nota fiscal avulsa, use 'Despesa')",
  "estabelecimento": "string|null (Nome do emissor ou banco)",
  "itens": [
    {
      "descricao": "string (Nome do estabelecimento da compra ou produto)",
      "data_item": "string|null (Data específica da compra/transação YYYY-MM-DD)",
      "valor": number (Valor da transação individual),
      "categoria": "string (Categoria do gasto)"
    }
  ]
}

Categorias permitidas:
Alimentação, Transporte, Saúde, Educação, Lazer, Compras, Serviços, Moradia, Outros.
`;
}

// Função auxiliar para converter string de data dd/mm/yyyy para Date ISO
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  // Se já for ISO
  if (dateStr.includes('-') && dateStr.length >= 10) {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Tenta formato brasileiro dd/mm/yyyy
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date();
}

// Rota protegida ou que aceita ID via body/header
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    const confirm =
      ['1', 'true', 'yes'].includes(String(req.body?.confirm || '').toLowerCase());
    // Verifica token manualmente aqui para permitir uploads sem token (retrocompatibilidade)
    // ou enforce se desejar. Vamos tentar extrair o usuário do token se presente.
    let userId = req.body.userId ? parseInt(req.body.userId) : null;
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          console.log(`Token verificado com sucesso. UserID do token: ${decoded.id}`);
          userId = decoded.id;
        }
      } catch (e) {
        console.warn('Token inválido ou expirado no upload:', e.message);
      }
    }

    if (!userId) {
        console.warn('UserID não identificado nem via token nem via body. Usando UserID 1 (default/admin).');
    } else {
        console.log(`UserID identificado para processamento: ${userId}`);
    }

    let filePath = req.file?.path;
    const originalName = req.file?.originalname || 'upload';
    const ext = path.extname(originalName).toLowerCase();

    if (filePath && ext) {
      const newPath = `${filePath}${ext}`;
      try {
        fs.renameSync(filePath, newPath);
        filePath = newPath;
      } catch (err) {
        console.error('Erro ao renomear arquivo:', err);
      }
    }
    
    // Tenta pegar o ID do beneficiário do body (enviado pelo frontend) ou usa 1 (default se não enviado, para compatibilidade)
    // Em produção, deveria pegar do token JWT decodificado (req.user.id)
    const beneficiarioId = userId || 1;

    console.log('--- Novo Arquivo Recebido ---');
    console.log('Caminho do arquivo (servidor):', filePath);
    console.log('Nome original:', originalName);
    console.log('ID Beneficiário:', beneficiarioId);

    if (!filePath) return res.status(400).json({ error: 'Arquivo não enviado.' });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = (req.body?.prompt && String(req.body.prompt)) || buildPrompt();
    // const ext = path.extname(originalName).toLowerCase(); // Já definido acima
    let rawOutput = '{}';

    if (ext === '.pdf') {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        const textContent = data.text;
        
        console.log('PDF Text extracted length:', textContent.length);

        if (!textContent || textContent.trim().length < 10) {
            console.warn('PDF com pouco ou nenhum texto extraído. Possível imagem escaneada.');
            // Opcional: Retornar erro específico ou deixar o OpenAI tentar (vai falhar provavelmente)
            // throw new Error('PDF sem texto identificável (imagem escaneada). Converta para JPG/PNG.');
        }

        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'text', text: `Conteúdo do PDF:\n${textContent}` },
              ],
            },
          ],
        });
        rawOutput = completion.choices[0]?.message?.content ?? '{}';
      } catch (pdfErr) {
        console.error('Erro ao processar PDF:', pdfErr);
        throw new Error('Falha ao ler o arquivo PDF. Certifique-se de que não é um PDF de imagem escaneada sem OCR prévio ou corrompido.');
      }
    } else if (ext === '.txt') {
      const text = fs.readFileSync(filePath, 'utf8');
      const response = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: prompt },
              { type: 'input_text', text },
            ],
          },
        ],
        text: { format: { type: 'json_object' } },
      });
      rawOutput = response.output_text ?? '{}';
    } else {
      // Trata imagem
      const buffer = fs.readFileSync(filePath);
      const base64 = buffer.toString('base64');
      const mime = ext === '.png' ? 'image/png' : 'image/jpeg';

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
            ],
          },
        ],
      });
      rawOutput = completion.choices[0]?.message?.content ?? '{}';
    }

    console.log('--- RAW OPENAI OUTPUT ---');
    console.log(rawOutput);
    console.log('-------------------------');

    let json;
    try {
      // Limpeza básica se a IA retornar Markdown code blocks
      const cleanOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      json = JSON.parse(cleanOutput);
      console.log('AI Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (err) {
      console.error('Erro no parse da IA:', err);
      return res.status(422).json({ error: 'Resposta inválida da IA', raw: rawOutput });
    }

    if (!confirm) {
      if (filePath) fs.unlink(filePath, () => {});
      return res.json(json);
    }

    const timestamp = Date.now();
    const safeExt = ext || '.png';
    const storedFileName = `${timestamp}${safeExt}`;
    const storedFilePath = path.join(imagesDir, storedFileName);
    fs.copyFileSync(filePath, storedFilePath);
    fs.unlink(filePath, () => {});

    // Salva os dados no Banco de Dados via Prisma (SQLite)
    try {
      // Normaliza itens (pode vir como 'items' ou 'itens')
      const itemsList = json.itens || json.items || [];

      const userExists = await prisma.beneficiario.findUnique({ where: { id_beneficiario: beneficiarioId } });
      
      // Se não existir o usuário 1 e nenhum outro foi passado, cria um padrão
      let finalUserId = beneficiarioId;
      if (!userExists) {
          // Tenta encontrar o primeiro usuário
          const firstUser = await prisma.beneficiario.findFirst();
          if (firstUser) {
              finalUserId = firstUser.id_beneficiario;
          } else {
             // Se não tiver nenhum usuário, cria um padrão
             const newUser = await prisma.beneficiario.create({
                 data: { nome: 'Usuário Padrão', login: 'admin', email: 'admin@admin.com', senha: '123' }
             });
             finalUserId = newUser.id_beneficiario;
          }
      }

      // Garante Tipos de Despesa Básicos
      let tipoDespesa = await prisma.tipoDespesa.findFirst();
      if (!tipoDespesa) {
         tipoDespesa = await prisma.tipoDespesa.create({ data: { descricao: 'Geral' } });
      }

      // Lógica de fallback para Fatura
      // Se tiver muitos itens, ou se o prompt detectou fatura, ou se o contexto for explicitamente fatura
      const contextFatura = req.body.context === 'fatura';
      
      const isFatura = 
        contextFatura ||
        (json.tipoGasto && json.tipoGasto.toLowerCase().includes('fatura')) || 
        (itemsList && itemsList.length > 1) ||
        (json.estabelecimento && json.estabelecimento.toLowerCase().includes('fatura'));
      
      const dataEvento = parseDate(json.data);

      if (isFatura) {
        console.log('Classificado como FATURA/MÚLTIPLOS ITENS (Contexto: ' + req.body.context + ')');
        
        // Força tipoGasto para 'Fatura' caso tenha entrado por ter múltiplos itens ou contexto
        json.tipoGasto = 'Fatura';
        // Fluxo FATURA
        // Garante Cartão e Verificador Dummy se não existirem
        let cartao = await prisma.cartao.findFirst({
            where: { id_beneficiario: finalUserId }
        });
        if (!cartao) {
            cartao = await prisma.cartao.create({
                data: { numero: '0000', validade: new Date(), data_emissao: new Date(), id_beneficiario: finalUserId }
            });
        }
        let verificador = await prisma.verificador.findFirst();
        if (!verificador) {
            verificador = await prisma.verificador.create({
                data: { nome: 'Sistema', cargo: 'Auto', email: 'sys@sys.com' }
            });
        }

        // Recalcula total se necessário
        let finalValorTotal = typeof json.valorTotal === 'number' ? json.valorTotal : 0;
        const sumItems = itemsList.reduce((acc, item) => acc + (typeof item.valor === 'number' ? item.valor : 0), 0);
        
        if (finalValorTotal === 0 && sumItems > 0) {
            finalValorTotal = sumItems;
            console.log(`Valor total corrigido pela soma dos itens: ${finalValorTotal}`);
        }

        const novaFatura = await prisma.fatura.create({
          data: {
            id_cartao: cartao.id_cartao,
            valor_fatura: finalValorTotal,
            data_fatura: dataEvento,
            id_verificador: verificador.id_verificador,
          }
        });

        console.log(`Fatura criada. ID: ${novaFatura.id_fatura}`);
        console.log(`Quantidade de itens para salvar: ${itemsList.length}`);

        const itensCriados = [];
        if (itemsList && Array.isArray(itemsList)) {
          for (const item of itemsList) {
            // Tenta encontrar ou criar a categoria específica
            let catId = tipoDespesa.id_tipo_despesa; // Default: Geral
            if (item.categoria) {
                const catExistente = await prisma.tipoDespesa.findFirst({
                    where: { descricao: item.categoria }
                });
                if (catExistente) {
                    catId = catExistente.id_tipo_despesa;
                } else {
                    const novaCat = await prisma.tipoDespesa.create({
                        data: { descricao: item.categoria }
                    });
                    catId = novaCat.id_tipo_despesa;
                }
            }

            // Cria Despesa para o item
            const novaDespesa = await prisma.despesa.create({
              data: {
                id_tipo_despesa: catId,
                id_beneficiario: finalUserId,
                data_despesa: item.data_item ? parseDate(item.data_item) : dataEvento,
                valor: typeof item.valor === 'number' ? item.valor : 0,
                cnpj_fornecedor: item.descricao || json.estabelecimento || null,
              }
            });

            // Cria ItemFatura ligando
            const novoItem = await prisma.itemFatura.create({
              data: {
                id_fatura: novaFatura.id_fatura,
                id_despesa: novaDespesa.id_despesa,
                valor_item: typeof item.valor === 'number' ? item.valor : 0,
                data_item: item.data_item ? parseDate(item.data_item) : dataEvento,
                status_analise: 'Pendente',
                justificativa: item.descricao || 'Item de fatura'
              }
            });
            itensCriados.push(novoItem);
            console.log(`Item salvo: ${item.descricao} - R$ ${item.valor}`);
          }
        }
        
        console.log(`Fatura salva ID: ${novaFatura.id_fatura} com ${itensCriados.length} itens.`);
        return res.json({ ...json, dbId: novaFatura.id_fatura, type: 'fatura' });

      } else {
        // Fluxo DESPESA AVULSA
        const novaDespesa = await prisma.despesa.create({
          data: {
            id_tipo_despesa: tipoDespesa.id_tipo_despesa,
            id_beneficiario: finalUserId,
            data_despesa: dataEvento,
            valor: typeof json.valorTotal === 'number' ? json.valorTotal : 0,
            cnpj_fornecedor: json.estabelecimento || null,
          }
        });
        
        console.log(`Despesa salva ID: ${novaDespesa.id_despesa}`);
        return res.json({ ...json, dbId: novaDespesa.id_despesa, type: 'despesa' });
      }

    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      return res.json({ ...json, _warning: 'Erro ao salvar no banco de dados', _dbError: dbError.message });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

// Novo Endpoint: Listar Histórico (compatível com Home.vue)
app.post('/api/expenses', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { valorTotal, data, estabelecimento, tipoGasto } = req.body;
    
    const valor = parseFloat(valorTotal) || 0;
    const dataDespesa = parseDate(data);
    
    let tipoDespesa = await prisma.tipoDespesa.findFirst();
    if (!tipoDespesa) {
         tipoDespesa = await prisma.tipoDespesa.create({ data: { descricao: 'Geral' } });
    }

    const novaDespesa = await prisma.despesa.create({
      data: {
        id_tipo_despesa: tipoDespesa.id_tipo_despesa,
        id_beneficiario: userId,
        data_despesa: dataDespesa,
        valor: valor,
        cnpj_fornecedor: estabelecimento || 'Manual',
      }
    });
    
    if (req.file) {
        fs.unlink(req.file.path, () => {}); // Remove temp file if any
    }
    
    res.json({ ...novaDespesa, dbId: novaDespesa.id_despesa, type: 'despesa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar despesa' });
  }
});

app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const despesas = await prisma.despesa.findMany({
      where: { 
        id_beneficiario: userId,
        items_fatura: { none: {} }
      },
      orderBy: { data_despesa: 'desc' },
      take: 50
    });
    
    // Para faturas, precisamos filtrar faturas que tenham itens do usuário ou cartão do usuário
    // Simplificando: Assumindo que o cartão é do usuário.
    const faturas = await prisma.fatura.findMany({
      where: {
        cartao: {
          id_beneficiario: userId
        }
      },
      include: { 
        items_fatura: {
          include: { despesa: true }
        } 
      },
      orderBy: { data_fatura: 'desc' },
      take: 20
    });

    const response = [];

    // Formata Despesas
    for (const d of despesas) {
       // Se quiser excluir despesas que já estão em faturas, precisaria verificar.
       // Mas por simplificação, mostra tudo.
       response.push({
         id: d.id_despesa,
         createdAt: d.data_despesa,
         extractedData: {
            data: d.data_despesa,
            valorTotal: d.valor,
            estabelecimento: d.cnpj_fornecedor || 'Despesa Avulsa',
            tipoGasto: 'Despesa',
            itens: [{ descricao: 'Despesa única', valor: d.valor }]
         }
       });
    }

    // Formata Faturas
    for (const f of faturas) {
       response.push({
         id: f.id_fatura,
         createdAt: f.data_fatura,
         extractedData: {
            data: f.data_fatura,
            valorTotal: f.valor_fatura,
            estabelecimento: 'Fatura Cartão',
            tipoGasto: 'Fatura',
            itens: f.items_fatura.map(i => ({
               descricao: i.justificativa,
               valor: i.valor_item,
               categoria: 'Item Fatura'
            }))
         }
       });
    }

    // Ordena por data (mais recente primeiro)
    response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(response);
  } catch (err) {
    console.error(err);
    // Se der erro (ex: tabela não existe), retorna array vazio para não quebrar frontend
    res.json([]);
  }
});

// Novo Endpoint: Detalhes da Fatura
app.get('/api/fatura/:id', authenticateToken, async (req, res) => {
  try {
    const faturaId = parseInt(req.params.id);
    if (isNaN(faturaId)) return res.status(400).json({ error: 'ID inválido' });

    const fatura = await prisma.fatura.findUnique({
      where: { id_fatura: faturaId },
      include: {
        items_fatura: {
          include: { 
            despesa: {
              include: { tipo_despesa: true }
            }
          }
        }
      }
    });

    if (!fatura) return res.status(404).json({ error: 'Fatura não encontrada' });

    const response = {
      id: fatura.id_fatura,
      createdAt: fatura.data_fatura,
      extractedData: {
        data: fatura.data_fatura,
        valorTotal: fatura.valor_fatura,
        estabelecimento: 'Fatura Cartão',
        tipoGasto: 'Fatura',
        itens: fatura.items_fatura.map(i => ({
           descricao: i.justificativa,
           valor: i.valor_item,
           categoria: i.despesa?.tipo_despesa?.descricao || 'Item Fatura',
           data_item: i.data_item
        }))
      }
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar fatura' });
  }
});

const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`OCR API rodando em http://localhost:${port}`);
});
