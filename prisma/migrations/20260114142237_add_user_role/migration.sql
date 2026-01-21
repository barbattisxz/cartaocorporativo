-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_beneficiario" (
    "id_beneficiario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER'
);
INSERT INTO "new_beneficiario" ("email", "id_beneficiario", "login", "nome", "senha") SELECT "email", "id_beneficiario", "login", "nome", "senha" FROM "beneficiario";
DROP TABLE "beneficiario";
ALTER TABLE "new_beneficiario" RENAME TO "beneficiario";
CREATE UNIQUE INDEX "beneficiario_login_key" ON "beneficiario"("login");
CREATE UNIQUE INDEX "beneficiario_email_key" ON "beneficiario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
