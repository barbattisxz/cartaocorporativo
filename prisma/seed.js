import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const plainPassword = 'admin@123';

  const existingAdmin = await prisma.beneficiario.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Usuário administrador já existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.beneficiario.create({
    data: {
      nome: 'Administrador',
      login: 'admin',
      email: email,
      senha: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Usuário administrador criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
