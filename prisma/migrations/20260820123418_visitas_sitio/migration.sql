-- CreateEnum
CREATE TYPE "DispositivoVisita" AS ENUM ('MOVIL', 'ESCRITORIO', 'TABLET', 'OTRO');

-- CreateTable
CREATE TABLE "VisitaSitio" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "dispositivo" "DispositivoVisita" NOT NULL DEFAULT 'OTRO',
    "ciudad" TEXT,
    "region" TEXT,
    "pais" TEXT,
    "fuente" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitaSitio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitaSitio_organizacionId_createdAt_idx" ON "VisitaSitio"("organizacionId", "createdAt");

-- AddForeignKey
ALTER TABLE "VisitaSitio" ADD CONSTRAINT "VisitaSitio_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
