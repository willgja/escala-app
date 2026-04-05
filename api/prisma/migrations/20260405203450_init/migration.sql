-- CreateTable
CREATE TABLE "Colaborador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "mat" TEXT,
    "func" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escala" (
    "id" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Escala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escala_colaboradorId_data_turno_key" ON "Escala"("colaboradorId", "data", "turno");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracao_chave_key" ON "Configuracao"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- AddForeignKey
ALTER TABLE "Escala" ADD CONSTRAINT "Escala_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
