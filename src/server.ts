import "dotenv/config"; 
import express from "express";
import { prisma } from "./lib/prisma";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GET / → status da API
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// GET /aeronaves → lista todas as aeronaves
app.get("/aeronaves", async (req, res) => {
  const aeronaves = await prisma.aeronave.findMany();
  res.json(aeronaves);
});

// GET /aeronaves/:id → busca uma aeronave por id
app.get("/aeronaves/:id", async (req, res) => {
  const id = Number(req.params.id);

  const aeronave = await prisma.aeronave.findUnique({
    where: { id },
  });

  if (!aeronave) {
    return res.status(404).json({ error: "Aeronave não encontrada" });
  }

  res.json(aeronave);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

