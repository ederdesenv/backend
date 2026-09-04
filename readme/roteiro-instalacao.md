# Roteiro de Instalação das Ferramentas

 cria um arquivo package.json num diretório de projeto Node.js, aceitando automaticamente todos os valores padrão, sem fazer perguntas interativas.

```bash
npm init -y
```
 ### package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev":"tsx watch src/server.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```
Obs: adicionar o atributo "dev":"tsx watch src/server.ts" para funcionar os comandos typescript

 ### Instalar Framework express.js
<https://expressjs.com/>

```bash
npm install express
```

 ### types/express

 types/express é um pacote de definições de tipos TypeScript para o framework Express.js

 ```bash
npm install -D typescript @types/node @types/express tsx
```
 ### Configurar o Typescript

Criar o arquivo de configuração oficial do TypeScript, chamado tsconfig.json

 ```bash
npx tsc --init 
```
 ### tsconfig.json
```jsonc
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "es2020",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```
Versão de javascript escolhida 2020 ->  "target": "es2020"

Maiores Informações:  
<https://www.typescriptlang.org/tsconfig/>

Criar a Pasta **src** onde ficara o código
```
backend/
└── src/
```
Criar o arquivo **server.ts** dentro da pasta src

```
backend/
├── src/
│   └── server.ts
├── package.json
└── tsconfig.json
```
 ### Instalar o Docker 

<https://www.docker.com/>

Verificar versão:

```bash
docker --version
```
🟡 Docker version 29.7.2, build a7dcaa6

Verificar versão do Docker Compose:

```bash
docker-compose --version
```
🟡 Docker Compose version v5.4.0

Criar o arquivo **docker-compose.yml** na raiz da pasta backend

```
backend/
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

 ### docker-compose.yml

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
Criar e iniciar todos os containers definidos no seu arquivo docker-compose.yml (ou compose.yaml), na ordem correta de dependências entre os serviços.

```bash
docker-compose up -d
```
 ### Instalação do Prisma

Instalar o prisma@7.10.0 

```bash
npm install prisma@7.10.0 --save-dev
```
Instalar o @prisma/client@7.10.0

```bash
npm install @prisma/client@7.10.0
```
Inicializar o prisma 

```bash
npx prisma init
```
Initialized Prisma in your project

  prisma/
    schema.prisma
  prisma7.config.ts
  .env
  .gitignore

 ### .env
 
  ```dotenv
# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add `import "dotenv/config";` to your `prisma7.config.ts` file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres
# server with the `prisma dev` CLI command, when not choosing any non-default ports or settings. The API key, unlike the
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="postgresql://admin:senha123@localhost:5432/cadastro_aeronaves?schema=public"
```
## Arquivo schema.prisma

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
Rodar o comando 

```bash
npx prisma migrate dev --name init
```
sincronizar as alterações do arquivo schema.prisma com o banco de dados

```powershell
PostgreSQL database cadastro_aeronaves created at localhost:5432
Applying migration `20260903232831_init`
The following migration(s) have been created and applied from new schema changes:
prisma\migrations/
  └─ 20260903232831_init/
    └─ migration.sql
Your database is now in sync with your schema.
```
## Prisma Studio 

O Prisma Studio é uma interface gráfica de usuário (GUI) visual integrada ao ecossistema do Prisma que funciona como um painel de controle para o seu banco de dados.

```bash
npx prisma studio
```
## Prisma adapter-pg

Driver Adapter oficial para bancos de dados PostgreSQL usando o driver node-postgres (pg)

```bash
npm install @prisma/adapter-pg
npm install pg
npm install -D @types/pg
```

## seed.ts
Mecanismo typescript que vai popular o banco de dados 

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
```
Antes de executar o seed , para efeito de praticidade devemos configurar o comando que dara start no seed.

Acessar o **package.json** e adicionar nos pontos:

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
Acessar o **prisma7.config.ts** e adicionar **seed: "tsx prisma/seed.ts"** dentro da chave migrations.

Rodar o comando:
```bash
npx prisma db seed
```
```powershell
saida:
Loaded Prisma config from prisma7.config.ts.
Running seed command `tsx prisma/seed.ts` ...
Dados de aeronaves inseridos com sucesso.
The seed command has been executed.
```

## Visualizar os dados 

O Prisma Studio é uma interface gráfica visual e interativa para navegar, criar, modificar e excluir dados diretamente em bancos de dados gerenciados pelo Prisma ORM.

```bash
npx prisma studio
```

## Instalação do dotenv

Dotenv é uma biblioteca de programação usada para carregar variáveis de ambiente de um arquivo de texto chamado .env para a memória da aplicação

```bash
npm install dotenv
```

# Endpoints REST
## Requisições para configurar no Insomnia
| Nome da requisição | Método | URL |
|---|---|---|
| Status da API | `GET` | `http://localhost:3000/` |
| Listar aeronaves | `GET` | `http://localhost:3000/aeronaves` |
| Buscar aeronave por ID | `GET` | `http://localhost:3000/aeronaves/1` |

Para funcionar as Requisições foram realizadas as seguintes implementasções

**Implementação dos endpoints (src/server.ts)**
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
**Criar o arquivo src/lib/prisma.ts**
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
Executar o sistema 
```bash
npm run dev
```

saida:
```powershell
> backend@1.0.0 dev
> tsx watch src/server.ts

Servidor rodando em http://localhost:3000
```

# Arquitetura do Projeto

```
backend/
├── prisma/
│   ├── migrations/
│   │   └── 20260903232831_init/
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



