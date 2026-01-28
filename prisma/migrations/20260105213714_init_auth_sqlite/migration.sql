-- CreateTable
CREATE TABLE "despesa" (
    "id_despesa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_tipo_despesa" INTEGER NOT NULL,
    "id_beneficiario" INTEGER NOT NULL,
    "id_projeto" INTEGER,
    "data_despesa" DATETIME NOT NULL,
    "valor" REAL NOT NULL,
    "cnpj_fornecedor" TEXT,
    "imagem_nota" BLOB,
    CONSTRAINT "despesa_id_tipo_despesa_fkey" FOREIGN KEY ("id_tipo_despesa") REFERENCES "tipo_despesa" ("id_tipo_despesa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "despesa_id_beneficiario_fkey" FOREIGN KEY ("id_beneficiario") REFERENCES "beneficiario" ("id_beneficiario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "despesa_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "projeto" ("id_projeto") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fatura" (
    "id_fatura" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cartao" INTEGER NOT NULL,
    "valor_fatura" REAL NOT NULL,
    "data_fatura" DATETIME NOT NULL,
    "id_verificador" INTEGER NOT NULL,
    CONSTRAINT "fatura_id_cartao_fkey" FOREIGN KEY ("id_cartao") REFERENCES "cartao" ("id_cartao") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fatura_id_verificador_fkey" FOREIGN KEY ("id_verificador") REFERENCES "verificador" ("id_verificador") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tipo_despesa" (
    "id_tipo_despesa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "item_fatura" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_fatura" INTEGER NOT NULL,
    "id_despesa" INTEGER NOT NULL,
    "valor_item" REAL NOT NULL,
    "data_item" DATETIME NOT NULL,
    "status_analise" TEXT,
    "justificativa" TEXT,
    CONSTRAINT "item_fatura_id_fatura_fkey" FOREIGN KEY ("id_fatura") REFERENCES "fatura" ("id_fatura") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "item_fatura_id_despesa_fkey" FOREIGN KEY ("id_despesa") REFERENCES "despesa" ("id_despesa") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projeto" (
    "id_projeto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor_orcamento" REAL NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "centro_custo" TEXT NOT NULL,
    "numero_contrato" TEXT NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME
);

-- CreateTable
CREATE TABLE "beneficiario" (
    "id_beneficiario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cartao" (
    "id_cartao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "validade" DATETIME NOT NULL,
    "data_emissao" DATETIME NOT NULL,
    "id_beneficiario" INTEGER NOT NULL,
    CONSTRAINT "cartao_id_beneficiario_fkey" FOREIGN KEY ("id_beneficiario") REFERENCES "beneficiario" ("id_beneficiario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verificador" (
    "id_verificador" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "beneficiario_login_key" ON "beneficiario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiario_email_key" ON "beneficiario"("email");
