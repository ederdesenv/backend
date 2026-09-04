-- CreateTable
CREATE TABLE "aeronaves" (
    "id" SERIAL NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numero_serie" TEXT NOT NULL,
    "peso_maximo_decolagem" DECIMAL(10,2) NOT NULL,
    "codigo_sisant" TEXT NOT NULL,
    "capacidade_tanque" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aeronaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aeronaves_numero_serie_key" ON "aeronaves"("numero_serie");

-- CreateIndex
CREATE UNIQUE INDEX "aeronaves_codigo_sisant_key" ON "aeronaves"("codigo_sisant");
