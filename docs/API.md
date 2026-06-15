# DashLab API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Todas as requisições (exceto login/register) requerem um header:

```
Authorization: Bearer {token}
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register

Body:
{
  "email": "user@example.com",
  "password": "senha123",
  "nome": "João Silva",
  "role": "paciente" // ou "medico", "admin"
}

Response: 201
{
  "id": "uuid",
  "email": "user@example.com",
  "nome": "João Silva",
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### Login
```
POST /auth/login

Body:
{
  "email": "user@example.com",
  "password": "senha123"
}

Response: 200
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nome": "João Silva",
    "role": "paciente"
  }
}
```

#### Refresh Token
```
POST /auth/refresh

Body:
{
  "refreshToken": "refresh_token"
}

Response: 200
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### Pacientes

#### Listar Pacientes
```
GET /pacientes

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string (busca por nome ou CPF)

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "nome": "João Silva",
      "dataNascimento": "1990-01-15T00:00:00Z",
      "cpf": "123.456.789-00",
      "email": "joao@example.com",
      "telefone": "11999999999",
      "criado_em": "2024-01-10T10:00:00Z",
      "atualizado_em": "2024-01-10T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### Obter Paciente
```
GET /pacientes/:id

Response: 200
{
  "id": "uuid",
  "nome": "João Silva",
  "dataNascimento": "1990-01-15T00:00:00Z",
  "cpf": "123.456.789-00",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "exames": [
    {
      "id": "uuid",
      "tipoExame": "Sangue",
      "dataExame": "2024-01-10T10:00:00Z",
      "laboratorio": "Lab Centro",
      "status": "completo"
    }
  ]
}
```

#### Criar Paciente
```
POST /pacientes

Body:
{
  "nome": "João Silva",
  "dataNascimento": "1990-01-15",
  "cpf": "123.456.789-00",
  "email": "joao@example.com",
  "telefone": "11999999999"
}

Response: 201
{
  "id": "uuid",
  "nome": "João Silva",
  "dataNascimento": "1990-01-15T00:00:00Z",
  "cpf": "123.456.789-00",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "criado_em": "2024-01-10T10:00:00Z"
}
```

#### Atualizar Paciente
```
PUT /pacientes/:id

Body: (todos os campos opcionais)
{
  "nome": "João Silva",
  "telefone": "11999999999"
}

Response: 200
```

#### Deletar Paciente
```
DELETE /pacientes/:id

Response: 204
```

### Exames

#### Listar Exames de um Paciente
```
GET /pacientes/:pacienteId/exames

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- tipoExame: string (filtro)

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "tipoExame": "Sangue",
      "dataExame": "2024-01-10T10:00:00Z",
      "laboratorio": "Lab Centro",
      "status": "completo",
      "notas": "Exame normal",
      "resultados": [...]
    }
  ],
  "total": 1
}
```

#### Obter Exame Específico
```
GET /pacientes/:pacienteId/exames/:exameId

Response: 200
{
  "id": "uuid",
  "pacienteId": "uuid",
  "tipoExame": "Sangue",
  "dataExame": "2024-01-10T10:00:00Z",
  "laboratorio": "Lab Centro",
  "status": "completo",
  "notas": "Exame normal",
  "resultados": [
    {
      "id": "uuid",
      "nome": "Hemoglobina",
      "valor": 14.5,
      "unidade": "g/dL",
      "minimo": 12.0,
      "maximo": 17.0,
      "status": "normal"
    }
  ]
}
```

#### Criar Exame
```
POST /pacientes/:pacienteId/exames

Body:
{
  "tipoExame": "Sangue",
  "dataExame": "2024-01-10",
  "laboratorio": "Lab Centro",
  "status": "pendente",
  "notas": "Jejum de 8 horas"
}

Response: 201
```

#### Atualizar Exame
```
PUT /pacientes/:pacienteId/exames/:exameId

Body: (todos os campos opcionais)
{
  "status": "completo",
  "notas": "Exame finalizado"
}

Response: 200
```

#### Deletar Exame
```
DELETE /pacientes/:pacienteId/exames/:exameId

Response: 204
```

### Resultados

#### Listar Resultados de um Exame
```
GET /exames/:exameId/resultados

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "nome": "Hemoglobina",
      "valor": 14.5,
      "unidade": "g/dL",
      "minimo": 12.0,
      "maximo": 17.0,
      "status": "normal"
    }
  ]
}
```

#### Criar Resultado
```
POST /exames/:exameId/resultados

Body:
{
  "nome": "Hemoglobina",
  "valor": 14.5,
  "unidade": "g/dL",
  "minimo": 12.0,
  "maximo": 17.0
}

Response: 201
```

#### Atualizar Resultado
```
PUT /exames/:exameId/resultados/:resultadoId

Body: (todos os campos opcionais)
{
  "valor": 15.0,
  "status": "alto"
}

Response: 200
```

#### Deletar Resultado
```
DELETE /exames/:exameId/resultados/:resultadoId

Response: 204
```

## Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
