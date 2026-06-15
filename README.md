# DashLab - Dashboard de Exames Laboratoriais

## 📋 Descrição

DashLab é um dashboard completo para registrar, armazenar e comparar exames de laboratório. Permite visualizar histórico de exames, comparar resultados ao longo do tempo e identificar anomalias.

## 🎯 Funcionalidades

- ✅ **Cadastro de Exames** - Lançamento de novos exames com dados do paciente
- ✅ **Histórico** - Armazenamento completo de exames por paciente
- ✅ **Comparação** - Visualização lado a lado de múltiplos exames
- ✅ **Gráficos** - Evolução de valores ao longo do tempo
- ✅ **Alertas** - Identificação de valores fora dos limites normais
- ✅ **Autenticação** - Sistema de login seguro

## 🏗️ Arquitetura

```
dashlab/
├── backend/           # API Node.js + Express
├── frontend/          # React + TypeScript + Vite
├── docker-compose.yml # Orquestração de containers
└── docs/              # Documentação
```

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup com Docker

```bash
# Clone o repositório
git clone https://github.com/dfbruns-stack/dashlab.git
cd dashlab

# Inicie os containers
docker-compose up -d

# Frontend estará em: http://localhost:5173
# API estará em: http://localhost:3000
```

### Setup Manual

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Estrutura de Pastas

### Backend
```
backend/
├── src/
│   ├── controllers/   # Controladores (lógica de negócio)
│   ├── models/        # Modelos de dados (Sequelize/Prisma)
│   ├── routes/        # Rotas da API
│   ├── middleware/    # Middlewares (auth, validation)
│   ├── services/      # Serviços auxiliares
│   ├── utils/         # Utilidades
│   └── server.ts      # Entrada da aplicação
├── migrations/        # Migrations do banco de dados
├── tests/             # Testes unitários
├── .env.example       # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/    # Componentes React reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Chamadas à API
│   ├── hooks/         # Custom hooks
│   ├── types/         # Tipos TypeScript
│   ├── styles/        # Estilos globais
│   ├── utils/         # Utilidades
│   └── App.tsx        # Componente raiz
├── public/            # Arquivos estáticos
├── vite.config.ts     # Configuração Vite
├── tsconfig.json      # Configuração TypeScript
└── tailwind.config.js # Configuração Tailwind CSS
```

## 🔧 Stack Tecnológico

### Backend
- **Runtime**: Node.js com TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (com Prisma ORM)
- **Autenticação**: JWT
- **Validação**: Zod
- **Testes**: Jest

### Frontend
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **UI Components**: Headless UI + custom components
- **Gráficos**: Recharts
- **State Management**: React Query + Context API
- **HTTP Client**: Axios

## 🗄️ Modelo de Dados

### Pacientes
```
- ID (UUID)
- Nome
- Data de Nascimento
- CPF
- Contato
- Criado em
- Atualizado em
```

### Exames
```
- ID (UUID)
- Paciente ID (FK)
- Tipo de Exame (Sangue, Urina, etc.)
- Data do Exame
- Laboratorio
- Status
- Notas
- Criado em
- Atualizado em
```

### Resultados
```
- ID (UUID)
- Exame ID (FK)
- Nome do Teste
- Valor
- Unidade
- Valor Mínimo
- Valor Máximo
- Status (Normal/Baixo/Alto)
```

## 🔐 Autenticação

- Login com email/senha
- JWT tokens com refresh token
- Role-based access control (RBAC)
- Roles: Admin, Médico, Paciente

## 📊 API Endpoints (Principal)

```
# Autenticação
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

# Pacientes
GET    /api/pacientes
GET    /api/pacientes/:id
POST   /api/pacientes
PUT    /api/pacientes/:id
DELETE /api/pacientes/:id

# Exames
GET    /api/pacientes/:pacienteId/exames
GET    /api/pacientes/:pacienteId/exames/:exameId
POST   /api/pacientes/:pacienteId/exames
PUT    /api/pacientes/:pacienteId/exames/:exameId
DELETE /api/pacientes/:pacienteId/exames/:exameId

# Resultados
GET    /api/exames/:exameId/resultados
POST   /api/exames/:exameId/resultados
PUT    /api/exames/:exameId/resultados/:resultadoId
```

## 🧪 Testes

```bash
# Backend
cd backend
npm run test
npm run test:coverage

# Frontend
cd frontend
npm run test
```

## 📝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
2. Commit suas mudanças (`git commit -m 'Add minha-feature'`)
3. Push para a branch (`git push origin feature/minha-feature`)
4. Abra um Pull Request

## 📄 Licença

MIT License - veja LICENSE para detalhes

## 👤 Autor

dfbruns-stack
