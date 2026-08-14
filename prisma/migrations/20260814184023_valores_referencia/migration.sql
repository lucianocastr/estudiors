-- CreateEnum
CREATE TYPE "IndicadorReferencia" AS ENUM ('CANASTA_CRIANZA', 'SMVM', 'JUS');

-- CreateTable
CREATE TABLE "ValorReferencia" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "indicador" "IndicadorReferencia" NOT NULL,
    "periodo" TEXT NOT NULL,
    "vigenteDesde" TIMESTAMP(3) NOT NULL,
    "valores" JSONB NOT NULL,
    "fuente" TEXT NOT NULL,
    "fuenteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ValorReferencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ValorReferencia_organizacionId_indicador_idx" ON "ValorReferencia"("organizacionId", "indicador");

-- CreateIndex
CREATE INDEX "ValorReferencia_deletedAt_idx" ON "ValorReferencia"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ValorReferencia_organizacionId_indicador_periodo_key" ON "ValorReferencia"("organizacionId", "indicador", "periodo");

-- AddForeignKey
ALTER TABLE "ValorReferencia" ADD CONSTRAINT "ValorReferencia_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
