\# Roteiro de Instalação das Ferramentas



\## Sobre o projeto



Este documento apresenta a instalação e configuração do backend do protótipo do TCC: uma API REST em Node.js, TypeScript e Express, com PostgreSQL via Prisma ORM, rodando em Docker.



O domínio escolhido foi o cadastro de drones agrícolas (fabricante, modelo, número de série, peso, código SISANT/ANAC e capacidade de tanque), por representar um cenário real que exige registro e rastreabilidade regulatória, permitindo controle centralizado da frota. Academicamente, o domínio oferece um modelo de dados simples e realista para demonstrar arquitetura backend, modelagem de dados e exposição de API REST.



\---



\## Pré-requisitos



\- \[Node.js](https://nodejs.org/) instalado

\- \[Docker](https://www.docker.com/) e \[Docker Compose](https://docs.docker.com/compose/) instalados

\- Editor de código (recomendado: VS Code)



\---



\## 1. Inicializar o projeto Node.js



Cria um arquivo `package.json` num diretório de projeto Node.js, aceitando automaticamente todos os valores padrão, sem fazer perguntas interativas.



```bash

npm init -y

```



Resultado:

```json

{

&#x20; "name": "backend",

&#x20; "version": "1.0.0",

&#x20; "description": "",

&#x20; "main": "index.js",

&#x20; "scripts": {

&#x20;   "test": "echo \\"Error: no test specified\\" \&\& exit 1"

&#x20; },

&#x20; "keywords": \[],

&#x20; "author": "",

&#x20; "license": "ISC",

&#x20; "type": "commonjs"

}

```



\---



\## 2. Instalar o framework Express



Documentação oficial: \[Express.js](https://expressjs.com/)



```bash

npm install express

```



\---



\## 3. Instalar TypeScript e ferramentas de desenvolvimento



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



\---



\## 4. Configurar o `tsconfig.json`



```jsonc

{

&#x20; // Visit https://aka.ms/tsconfig to read more about this file

&#x20; "compilerOptions": {

&#x20;   // Environment Settings

&#x20;   "module": "nodenext",

&#x20;   "target": "esnext",

&#x20;   "types": \[],



&#x20;   // Other Outputs

&#x20;   "sourceMap": true,

&#x20;   "declaration": true,

&#x20;   "declarationMap": true,



&#x20;   // Stricter Typechecking Options

&#x20;   "noUncheckedIndexedAccess": true,

&#x20;   "exactOptionalPropertyTypes": true,



&#x20;   // Recommended Options

&#x20;   "strict": true,

&#x20;   "verbatimModuleSyntax": true,

&#x20;   "isolatedModules": true,

&#x20;   "noUncheckedSideEffectImports": true,

&#x20;   "moduleDetection": "force",

&#x20;   "skipLibCheck": true,



&#x20;   // Import compatibility

&#x20;   "esModuleInterop": true,

&#x20;   "forceConsistentCasingInFileNames": true

&#x20; }

}

```



> \*\*Observação:\*\* a opção `forceConsistentCasingInFileNames` garante que a caixa (maiúsculas/minúsculas) dos nomes de arquivo nos imports seja respeitada — importante porque o Windows é \*case-insensitive\*, mas o Linux (ambiente comum de produção) é \*case-sensitive\*.



\---



\## 5. Configurar o Docker Compose (PostgreSQL)



```yaml

services:

&#x20; # Nosso serviço de banco de dados

&#x20; postgres:

&#x20;   image: postgres:15-alpine  # Versão leve e estável do PostgreSQL

&#x20;   container\_name: aeronaves\_db

&#x20;   environment:

&#x20;     POSTGRES\_USER: admin       # Usuário do banco

&#x20;     POSTGRES\_PASSWORD: senha123 # Senha (em produção, use algo mais seguro!)

&#x20;     POSTGRES\_DB: cadastro\_aeronaves # Nome do nosso banco

&#x20;   ports:

&#x20;     - "5432:5432"  # Porta padrão do PostgreSQL

&#x20;   volumes:

&#x20;     # Isso garante que os dados persistam mesmo se o container parar

&#x20;     - postgres\_data:/var/lib/postgresql/data



volumes:

&#x20; postgres\_data:

```



> ⚠️ \*\*Segurança:\*\* a senha `senha123` está aqui apenas como exemplo didático. Em um ambiente real, ela deve ser movida para um arquivo `.env` (não versionado no Git).



\### Subir o container



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



\---



\## 6. Instalar o Prisma ORM



```bash

npm install prisma@7.10.0 --save-dev

```



Resultado:

```powershell

PS C:\\eder\_dados\\POS\\TCC\\prototipo\_web\_desenv\_LOCAL1\\backend> npm install prisma@7.10.0 --save-dev

added 134 packages, and audited 219 packages in 3m

41 packages are looking for funding

&#x20; run `npm fund` for details

4 high severity vulnerabilities

To address all issues (including breaking changes), run:

&#x20; npm audit fix --force

Run `npm audit` for details.

```



\### Inicializar o Prisma no projeto



```bash

npx prisma init

```



Isso cria a pasta `prisma/` (com `schema.prisma`), o arquivo de configuração `prisma7.config.ts` e o `.env`.



\---



\## 7. Definir a model `Aeronave` (`prisma/schema.prisma`)



```prisma

generator client {

&#x20; provider = "prisma-client"

&#x20; output   = "../src/generated/prisma"

}



datasource db {

&#x20; provider = "postgresql"

}



model Aeronave {

&#x20; id                   Int      @id @default(autoincrement())

&#x20; fabricante           String

&#x20; modelo               String

&#x20; numeroSerie          String   @unique @map("numero\_serie")

&#x20; pesoMaximoDecolagem  Decimal  @map("peso\_maximo\_decolagem") @db.Decimal(10, 2)

&#x20; codigoSisant         String   @unique @map("codigo\_sisant")

&#x20; capacidadeTanque     Decimal  @map("capacidade\_tanque") @db.Decimal(10, 2)

&#x20; createdAt            DateTime @default(now()) @map("created\_at")

&#x20; updatedAt            DateTime @updatedAt @map("updated\_at")



&#x20; @@map("aeronaves")

}

```



Campos `numeroSerie` e `codigoSisant` são marcados como `@unique`, já que representam identificadores reais e não repetíveis de cada aeronave (número de série de fabricação e código de registro no SISANT/ANAC).



\---



\## 8. Configurar a variável de ambiente (`.env`)



```dotenv

DATABASE\_URL="postgresql://admin:senha123@localhost:5432/cadastro\_aeronaves?schema=public"

```



> ⚠️ No Prisma 7, as variáveis do `.env` \*\*não são carregadas automaticamente\*\*. É necessário `import "dotenv/config"` nos arquivos que dependem delas (`prisma7.config.ts` e `src/server.ts`).



\---



\## 9. Configurar o `prisma7.config.ts`



```typescript

import "dotenv/config";

import { defineConfig } from "prisma/config";



export default defineConfig({

&#x20; schema: "prisma/schema.prisma",

&#x20; migrations: {

&#x20;   path: "prisma/migrations",

&#x20;   seed: "tsx prisma/seed.ts",

&#x20; },

&#x20; datasource: {

&#x20;   url: process.env\["DATABASE\_URL"],

&#x20; },

});

```



\---



\## 10. Rodar a primeira migration



```bash

npx prisma migrate dev --name init

```



Resultado:

```powershell

Loaded Prisma config from prisma7.config.ts.

Prisma schema loaded from prisma\\schema.prisma.

Datasource "db": PostgreSQL database "cadastro\_aeronaves", schema "public" at "localhost:5432"

PostgreSQL database cadastro\_aeronaves created at localhost:5432

Applying migration `20260903232831\_init`

The following migration(s) have been created and applied from new schema changes:

prisma\\migrations/

&#x20; └─ 20260903232831\_init/

&#x20;   └─ migration.sql

Your database is now in sync with your schema.

```



Esse comando compara a `schema.prisma` com o banco, gera o SQL da migration, aplica no PostgreSQL e gera automaticamente o Prisma Client.



\---



\## 11. Popular o banco com dados iniciais (`prisma/seed.ts`)



Como o Prisma 7 exige o uso de um \*\*driver adapter\*\*, instale as dependências necessárias:



```bash

npm install @prisma/adapter-pg pg

npm install -D @types/pg

```



```typescript

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";



const connectionString = process.env.DATABASE\_URL;



if (!connectionString) {

&#x20; throw new Error("DATABASE\_URL não definida.");

}



const adapter = new PrismaPg({

&#x20; connectionString,

});



const prisma = new PrismaClient({

&#x20; adapter,

});



async function main() {

&#x20; const aeronaves = \[

&#x20;   {

&#x20;     fabricante: "DJI",

&#x20;     modelo: "Agras T30",

&#x20;     numeroSerie: "1ZNBH2R00A7F31",

&#x20;     pesoMaximoDecolagem: "38.5",

&#x20;     codigoSisant: "PP482913567",

&#x20;     capacidadeTanque: "30",

&#x20;   },

&#x20;   {

&#x20;     fabricante: "XAG",

&#x20;     modelo: "P100 Pro",

&#x20;     numeroSerie: "XAG-P100-22K894",

&#x20;     pesoMaximoDecolagem: "52",

&#x20;     codigoSisant: "PP719045823",

&#x20;     capacidadeTanque: "50",

&#x20;   },

&#x20;   {

&#x20;     fabricante: "G-TEX",

&#x20;     modelo: "GT-40 Sprayer",

&#x20;     numeroSerie: "GTX40-2024-00512",

&#x20;     pesoMaximoDecolagem: "45.2",

&#x20;     codigoSisant: "PP356170924",

&#x20;     capacidadeTanque: "40",

&#x20;   },

&#x20;   {

&#x20;     fabricante: "DJI",

&#x20;     modelo: "Agras T50",

&#x20;     numeroSerie: "1ZNBH3S00B9K72",

&#x20;     pesoMaximoDecolagem: "58.1",

&#x20;     codigoSisant: "PP904381256",

&#x20;     capacidadeTanque: "50",

&#x20;   },

&#x20;   {

&#x20;     fabricante: "XAG",

&#x20;     modelo: "P60",

&#x20;     numeroSerie: "XAG-P60-19D407",

&#x20;     pesoMaximoDecolagem: "30.8",

&#x20;     codigoSisant: "PP128756349",

&#x20;     capacidadeTanque: "20",

&#x20;   },

&#x20; ];



&#x20; await prisma.aeronave.createMany({

&#x20;   data: aeronaves,

&#x20; });



&#x20; console.log("Dados de aeronaves inseridos com sucesso.");

}



main()

&#x20; .catch((error) => {

&#x20;   console.error("Erro ao executar o seed:", error);

&#x20;   process.exit(1);

&#x20; })

&#x20; .finally(async () => {

&#x20;   await prisma.$disconnect();

&#x20; });

```



\### Registrar o comando de seed no `package.json`



```json

"main": "index.js",

"prisma": {

&#x20; "seed": "tsx prisma/seed.js"

},

"scripts": {

&#x20; "test": "echo \\"Error: no test specified\\" \&\& exit 1",

&#x20; "dev": "tsx watch src/server.ts",

&#x20; "seed": "tsx prisma/seed.js"

},

```



\### Executar o seed



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



\---



\## 12. Centralizar a instância do Prisma Client (`src/lib/prisma.ts`)



```typescript

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";



const connectionString = process.env.DATABASE\_URL;



if (!connectionString) {

&#x20; throw new Error("DATABASE\_URL não definida.");

}



const adapter = new PrismaPg({

&#x20; connectionString,

});



export const prisma = new PrismaClient({

&#x20; adapter,

});

```



Centralizar a criação do `PrismaClient` evita múltiplas conexões desnecessárias com o banco e reduz repetição de código entre `seed.ts` e `server.ts`.



\---



\## 13. Implementar os endpoints da API (`src/server.ts`)



```typescript

import "dotenv/config";

import express from "express";

import { prisma } from "./lib/prisma";



const app = express();

const port = process.env.PORT || 3000;



app.use(express.json());



// GET / → status da API

app.get("/", (req, res) => {

&#x20; res.json({ status: "ok" });

});



// GET /aeronaves → lista todas as aeronaves

app.get("/aeronaves", async (req, res) => {

&#x20; const aeronaves = await prisma.aeronave.findMany();

&#x20; res.json(aeronaves);

});



// GET /aeronaves/:id → busca uma aeronave por id

app.get("/aeronaves/:id", async (req, res) => {

&#x20; const id = Number(req.params.id);



&#x20; const aeronave = await prisma.aeronave.findUnique({

&#x20;   where: { id },

&#x20; });



&#x20; if (!aeronave) {

&#x20;   return res.status(404).json({ error: "Aeronave não encontrada" });

&#x20; }



&#x20; res.json(aeronave);

});



app.listen(port, () => {

&#x20; console.log(`Servidor rodando em http://localhost:${port}`);

});

```



\### Endpoints implementados



| Endpoint | Método | Descrição |

|---|---|---|

| `/` | `GET` | Retorna o status da API |

| `/aeronaves` | `GET` | Retorna a lista de todas as aeronaves cadastradas |

| `/aeronaves/:id` | `GET` | Retorna uma aeronave específica (404 se não encontrada) |



\---



\## 14. Rodar o servidor



```bash

npm run dev

```



Resultado:

```powershell

> backend@1.0.0 dev

> tsx watch src/server.ts



Servidor rodando em http://localhost:3000

```



\---



\## 15. Testar os endpoints no Insomnia



| Nome da requisição | Método | URL |

|---|---|---|

| Status da API | `GET` | `http://localhost:3000/` |

| Listar aeronaves | `GET` | `http://localhost:3000/aeronaves` |

| Buscar aeronave por ID | `GET` | `http://localhost:3000/aeronaves/1` |



\### Respostas esperadas



\*\*`GET /`\*\*

```json

{ "status": "ok" }

```



\*\*`GET /aeronaves`\*\*

```json

\[

&#x20; {

&#x20;   "id": 1,

&#x20;   "fabricante": "DJI",

&#x20;   "modelo": "Agras T30",

&#x20;   "numeroSerie": "1ZNBH2R00A7F31",

&#x20;   "pesoMaximoDecolagem": "38.5",

&#x20;   "codigoSisant": "PP482913567",

&#x20;   "capacidadeTanque": "30"

&#x20; }

]

```



\*\*`GET /aeronaves/1`\*\* (existe)

```json

{

&#x20; "id": 1,

&#x20; "fabricante": "DJI",

&#x20; "modelo": "Agras T30"

}

```



\*\*`GET /aeronaves/999`\*\* (não existe) — status `404 Not Found`

```json

{ "error": "Aeronave não encontrada" }

```



\---



\## Estrutura final do projeto



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



\---



\## Considerações finais



Este roteiro cobre a jornada completa de configuração do backend, desde a inicialização do projeto Node.js até a disponibilização de uma API REST funcional, conectada a um banco PostgreSQL via Prisma ORM, com dados de exemplo populados via seed. A escolha do domínio de \*\*cadastro de aeronaves não tripuladas\*\* demonstra, de forma prática, conceitos de modelagem de dados, persistência e exposição de serviços REST aplicados a um cenário real e relevante do setor de drones agrícolas — servindo de base para a discussão técnica apresentada neste TCC.



