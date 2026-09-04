import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const aeronaves = [
    {
      fabricante: "DJI",
      modelo: "Agras T30",
      numeroSerie: "1ZNBH2R00A7F31",
      pesoMaximoDecolagem: "38.5",
      codigoSisant: "PP482913567",
      capacidadeTanque: "30",
    },
    {
      fabricante: "XAG",
      modelo: "P100 Pro",
      numeroSerie: "XAG-P100-22K894",
      pesoMaximoDecolagem: "52",
      codigoSisant: "PP719045823",
      capacidadeTanque: "50",
    },
    {
      fabricante: "G-TEX",
      modelo: "GT-40 Sprayer",
      numeroSerie: "GTX40-2024-00512",
      pesoMaximoDecolagem: "45.2",
      codigoSisant: "PP356170924",
      capacidadeTanque: "40",
    },
    {
      fabricante: "DJI",
      modelo: "Agras T50",
      numeroSerie: "1ZNBH3S00B9K72",
      pesoMaximoDecolagem: "58.1",
      codigoSisant: "PP904381256",
      capacidadeTanque: "50",
    },
    {
      fabricante: "XAG",
      modelo: "P60",
      numeroSerie: "XAG-P60-19D407",
      pesoMaximoDecolagem: "30.8",
      codigoSisant: "PP128756349",
      capacidadeTanque: "20",
    },
  ];

  await prisma.aeronave.createMany({
    data: aeronaves,
  });

  console.log("Dados de aeronaves inseridos com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });