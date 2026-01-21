import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

// Função de delay para esperar o servidor subir
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('--- Iniciando Verificação de Hash de Senha ---');
  
  // 1. Configuração do Cliente Prisma
  const prisma = new PrismaClient();
  const email = `test_hash_${Date.now()}@example.com`;
  const password = 'minha_senha_secreta';
  const login = `user_${Date.now()}`;

  try {
    // 2. Tentar Registrar Usuário via API
    console.log(`\n1. Enviando requisição de registro para ${email}...`);
    let regRes;
    try {
        regRes = await fetch('http://localhost:5175/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: 'Usuário Teste Hash',
            login: login,
            email: email,
            senha: password
        })
        });
    } catch (e) {
        console.error('ERRO: Não foi possível conectar ao servidor (http://localhost:5175). Certifique-se de que "npm run server" está rodando.');
        process.exit(1);
    }

    const regData = await regRes.json();
    
    if (regRes.ok) {
        console.log('✅ Registro bem-sucedido via API.');
    } else {
        console.error('❌ Falha no registro via API:', regData);
        process.exit(1);
    }

    // 3. Verificar diretamente no Banco de Dados
    console.log('\n2. Consultando banco de dados para verificar armazenamento...');
    const user = await prisma.beneficiario.findFirst({
      where: { email: email }
    });

    if (!user) {
      console.error('❌ ERRO CRÍTICO: Usuário registrado não encontrado no banco de dados!');
      process.exit(1);
    }

    console.log(`   Senha original enviada: "${password}"`);
    console.log(`   Senha salva no banco:   "${user.senha}"`);

    // Verifica formato Bcrypt ($2a$, $2b$, etc)
    const isBcryptHash = user.senha.startsWith('$2') && user.senha.length === 60;
    
    if (isBcryptHash) {
        console.log('✅ SUCESSO: A senha está armazenada como um hash Bcrypt válido.');
    } else if (user.senha === password) {
        console.error('❌ FALHA DE SEGURANÇA: A senha foi salva em texto plano!');
    } else {
        console.warn('⚠️ AVISO: A senha está diferente do original, mas não parece um hash bcrypt padrão (pode ser outro algoritmo ou erro).');
    }

    // 4. Testar Login com a senha original
    console.log('\n3. Testando Login com a senha original...');
    const loginRes = await fetch('http://localhost:5175/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            loginOrEmail: email,
            senha: password
        })
    });
    
    const loginData = await loginRes.json();

    if (loginRes.ok) {
        console.log('✅ Login realizado com sucesso! (A comparação de hash funcionou)');
    } else {
        console.error('❌ Falha no login:', loginData);
    }

    // 5. Testar Login com senha errada
    console.log('\n4. Testando Login com senha incorreta (deve falhar)...');
    const failRes = await fetch('http://localhost:5175/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            loginOrEmail: email,
            senha: password + '_errada'
        })
    });

    if (failRes.status === 400 || failRes.status === 401) {
        console.log('✅ Login rejeitado corretamente para senha inválida.');
    } else {
        console.error('❌ Comportamento inesperado para senha errada. Status:', failRes.status);
    }

  } catch (err) {
    console.error('Erro inesperado no script:', err);
  } finally {
    // Limpeza
    console.log('\n--- Limpeza ---');
    if (email) {
        try {
            await prisma.beneficiario.deleteMany({ where: { email: email } });
            console.log('Usuário de teste removido do banco.');
        } catch (e) {
            console.error('Erro ao limpar usuário:', e);
        }
    }
    await prisma.$disconnect();
  }
}

run();
