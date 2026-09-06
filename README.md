# API + Banco de Dados com Docker, PostgreSQL e Prisma aplicados no contexto do TCC - Cadastro de Aeronaves

## Sobre o projeto

Este documento apresenta a instalação e configuração do backend do protótipo do TCC: uma API REST em Node.js, TypeScript e Express, com PostgreSQL via Prisma ORM, rodando em Docker.

O domínio escolhido foi o cadastro de drones agrícolas (fabricante, modelo, número de série, peso, código SISANT/ANAC e capacidade de tanque), por representar um cenário real que exige registro e rastreabilidade regulatória, permitindo controle centralizado da frota. Academicamente, o domínio oferece um modelo de dados simples e realista para demonstrar arquitetura backend, modelagem de dados e exposição de API REST.

## Pré-requisitos

- \[Node.js]<https://nodejs.org/>

- \[Docker]<https://www.docker.com/>  \[Docker Compose](https://docs.docker.com/compose/) 

- Editor de código VS Code

## 1. Inicializar o projeto Node.js

Cria um arquivo `package.json` num diretório de projeto Node.js, aceitando automaticamente todos os valores padrão, sem fazer perguntas interativas.

```bash

npm init -y

```

Resultado:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```
## 2. Instalar o framework Express

Documentação oficial: \[Express.js](https://expressjs.com/)

```bash
npm install express
```

## 3. Instalar TypeScript e ferramentas de desenvolvimento

```bash
npm install -D typescript @types/node @types/express tsx
```
Resultado:

```powershell

PS C:\\eder\_dados\\POS\\TCC\\prototipo\_web\_desenv\_LOCAL1\\backend> npm install -D typescript @types/node @types/express tsx

added 16 packages, and audited 17 packages in 9s

found 0 vulnerabilities

```

\- `typescript` → compilador TypeScript

\- `@types/node` / `@types/express` → tipagens para Node.js e Express

\- `tsx` → executa arquivos `.ts` diretamente, sem necessidade de compilação manual


## 4. Configurar o `tsconfig.json`



```jsonc
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // Environment Settings
    "module": "comonjs",
    "target": "es2020",
    "types": [],

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended Options
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,

    // Import compatibility
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 5. Configurar o Docker Compose (PostgreSQL)

```yaml
services:
  postgres:
    image: postgres:15-alpine  
    container_name: aeronaves_db
    environment:
      POSTGRES_USER: admin      
      POSTGRES_PASSWORD: senha123 
      POSTGRES_DB: cadastro_aeronaves 
    ports:
      - "5432:5432" 
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```



### Subir o container



```bash
docker-compose up -d
```



\- Cria a rede e os volumes necessários

\- Baixa a imagem `postgres:15-alpine`, se ainda não existir localmente

\- Sobe o container `aeronaves\_db` em background (modo \*detached\*)

Para conferir se subiu corretamente:

```bash
docker-compose ps
```
## 6. Instalar o Prisma ORM

```bash
npm install prisma@7.10.0 --save-dev
```
Resultado:
```powershell
PS C:\eder_dados\POS\TCC\prototipo_web_desenv_LOCAL1\backend> npm install prisma@7.10.0 --save-dev
added 134 packages, and audited 219 packages in 3m
41 packages are looking for funding
  run `npm fund` for details
4 high severity vulnerabilities
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
```

### Inicializar o Prisma no projeto

```bash
npx prisma init
```
Isso cria a pasta `prisma/` (com `schema.prisma`), o arquivo de configuração `prisma7.config.ts` e o `.env`.

> [!CAUTION]
> OBS.: ao rodar o comando **npx prisma init** foi exibido este aviso:

## Erro de Instalação de Skills

✖ **Skills install failed**

> **Aviso:** Failed to install Prisma agent skills. You can install them manually by running:

```bash
npx --yes skills@1.5.14 add prisma/skills --agent cursor claude-code codex windsurf --skill '*' -y
```

isso resultou na criação da pasta do agente de IA claude , trata-se de "manuais de instruções" que o Prisma disponibiliza para agentes de IA (Claude Code, Cursor, Windsurf, Codex) para o projeto.

## 7. Definir a model `Aeronave` (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Aeronave {
  id                   Int      @id @default(autoincrement())
  fabricante           String
  modelo               String
  numeroSerie          String   @unique @map("numero_serie")
  pesoMaximoDecolagem  Decimal  @map("peso_maximo_decolagem") @db.Decimal(10, 2)
  codigoSisant         String   @unique @map("codigo_sisant")
  capacidadeTanque     Decimal  @map("capacidade_tanque") @db.Decimal(10, 2)
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  @@map("aeronaves")
}
```

Campos `numeroSerie` e `codigoSisant` são marcados como `@unique`, já que representam identificadores reais e não repetíveis de cada aeronave (número de série de fabricação e código de registro no SISANT/ANAC).

## 8. Configurar a variável de ambiente (`.env`)

```dotenv

DATABASE\_URL="postgresql://admin:senha123@localhost:5432/cadastro\_aeronaves?schema=public"

```
## 9. Configurar o `prisma7.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

## 10. Rodar a primeira migration

```bash
npx prisma migrate dev --name init
```

Resultado:
```powershell
Loaded Prisma config from prisma7.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "cadastro_aeronaves", schema "public" at "localhost:5432"
PostgreSQL database cadastro_aeronaves created at localhost:5432
Applying migration `20260903232831_init`
The following migration(s) have been created and applied from new schema changes:
prisma\migrations/
  └─ 20260903232831_init/
    └─ migration.sql
Your database is now in sync with your schema.
```

Esse comando compara a `schema.prisma` com o banco, gera o SQL da migration, aplica no PostgreSQL e gera automaticamente o Prisma Client.

## 11. Popular o banco com dados iniciais (`prisma/seed.ts`)

Como o Prisma 7 exige o uso de um \*\*driver adapter\*\*, instale as dependências necessárias:

```bash
npm install @prisma/adapter-pg pg
npm install -D @types/pg
```

```typescript
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
    data:

### Registrar o comando de seed no `package.json`


```json
"main": "index.js",
"prisma": {
  "seed": "tsx prisma/seed.js"
},
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "tsx watch src/server.ts",
  "seed": "tsx prisma/seed.js"
},
```



### Executar o seed



```bash

npx prisma db seed

```



Resultado:

```powershell

Loaded Prisma config from prisma7.config.ts.

Running seed command `tsx prisma/seed.ts` ...

Dados de aeronaves inseridos com sucesso.

The seed command has been executed.

```


## 12. Centralizar a instância do Prisma Client (`src/lib/prisma.ts`)

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
});
```



Centralizar a criação do `PrismaClient` evita múltiplas conexões desnecessárias com o banco e reduz repetição de código entre `seed.ts` e `server.ts`.

## 13. Implementar os endpoints da API (`src/server.ts`)



```typescript
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
```



### Endpoints implementados



| Endpoint | Método | Descrição |
|---|---|---|
| `/` | `GET` | Retorna o status da API |
| `/aeronaves` | `GET` | Retorna a lista de todas as aeronaves cadastradas |
| `/aeronaves/:id` | `GET` | Retorna uma aeronave específica (404 se não encontrada) |

---



## 14. Rodar o servidor



```bash

npm run dev

```



Resultado:

```powershell

> backend@1.0.0 dev

> tsx watch src/server.ts



Servidor rodando em http://localhost:3000

```



---



## 15. Testar os endpoints no Insomnia



| Endpoint | Método | Descrição |
|---|---|---|
| `/` | `GET` | Retorna o status da API |
| `/aeronaves` | `GET` | Retorna a lista de todas as aeronaves cadastradas |
| `/aeronaves/:id` | `GET` | Retorna uma aeronave específica (404 se não encontrada) |

---



### Respostas esperadas



\*\*`GET /`\*\*

```json

{ "status": "ok" }

```



\*\*`GET /aeronaves`\*\*

```json
[
  {
    "id": 1,
    "fabricante": "DJI",
    "modelo": "Agras T30",
    "numeroSerie": "1ZNBH2R00A7F31",
    "pesoMaximoDecolagem": "38.5",
    "codigoSisant": "PP482913567",
    "capacidadeTanque": "30"
  }
]
```



\*\*`GET /aeronaves/1`\*\* (existe)

```json
{
  "id": 1,
  "fabricante": "DJI",
  "modelo": "Agras T30"
}
```


\*\*`GET /aeronaves/999`\*\* (não existe) — status `404 Not Found`

```json

{ "error": "Aeronave não encontrada" }

```



# Estrutura final do projeto



```

backend/

├── prisma/

│   ├── migrations/

│   │   └── 20260903232831\_init/

│   │       └── migration.sql

│   ├── schema.prisma

│   └── seed.ts

├── src/

│   ├── generated/

│   │   └── prisma/

│   │       ├── internal/

│   │       ├── models/

│   │       ├── browser.ts

│   │       ├── client.ts

│   │       ├── commonInputTypes.ts

│   │       ├── enums.ts

│   │       └── models.ts

│   ├── lib/

│   │   └── prisma.ts

│   └── server.ts

├── .env

├── .gitignore

├── docker-compose.yml

├── package.json

├── package-lock.json

├── prisma7.config.ts

├── tsconfig.json

└── roteiro-instalacao.md

```


## Considerações finais

Este roteiro cobre a jornada completa de configuração do backend, desde a inicialização do projeto Node.js até a disponibilização de uma API REST funcional, conectada a um banco PostgreSQL via Prisma ORM, com dados de exemplo populados via seed. A escolha do domínio de \*\*cadastro de aeronaves não tripuladas\*\* demonstra, de forma prática, conceitos de modelagem de dados, persistência e exposição de serviços REST aplicados a um cenário real e relevante do setor de drones agrícolas — servindo de base para a discussão técnica apresentada neste TCC.



