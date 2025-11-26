# API de Códigos de Consulta - Especificação

## 📋 Visão Geral

O frontend envia requisições para gerenciar códigos de consulta médica. Cada código é numérico (8-11 dígitos) e pode ter um nome/descrição opcional.

---

## 🔐 Autenticação

Todas as requisições devem incluir o header:

```http
Authorization: Bearer {access_token}
```

**Respostas de erro de autenticação:**

```json
// 401 Unauthorized
{
  "error": "Token inválido",
  "code": "INVALID_TOKEN",
  "reason": "expired"
}
```

---

## 📝 1. Adicionar Código(s)

### **Endpoint**
```
POST /api/codes
```

### **Request Headers**
```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

### **Request Body**

#### Cenário 1: Adicionar um código sem nome
```json
{
  "codes": [
    {
      "code": "123456789"
    }
  ]
}
```

#### Cenário 2: Adicionar um código com nome
```json
{
  "codes": [
    {
      "code": "123456789",
      "name": "Consulta com Cardiologista"
    }
  ]
}
```

#### Cenário 3: Adicionar múltiplos códigos (futuramente)
```json
{
  "codes": [
    {
      "code": "123456789",
      "name": "Consulta Cardiologista"
    },
    {
      "code": "987654321",
      "name": "Exame de Sangue"
    },
    {
      "code": "555555555"
    }
  ]
}
```

### **Validações no Frontend (já implementadas)**
- Código deve conter apenas números
- Código deve ter entre 8 e 11 dígitos
- Nome/descrição é opcional

### **Response Success - 201 Created**

```json
{
  "success": true,
  "added": [
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440001",
      "code": "123456789",
      "name": "Consulta com Cardiologista",
      "status": "pending",
      "lastUpdated": "2024-11-26T10:30:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "invalid": [],
  "message": "1 código(s) adicionado(s) com sucesso"
}
```

### **Response - Código já existe (201 Created com invalid)**

```json
{
  "success": true,
  "added": [
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440002",
      "code": "987654321",
      "name": "Exame de Sangue",
      "status": "pending",
      "lastUpdated": "2024-11-26T10:30:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "invalid": [
    "123456789 (já existe)"
  ],
  "message": "1 código(s) adicionado(s) com sucesso"
}
```

### **Response Error - 400 Bad Request**

```json
{
  "error": "Código inválido",
  "field": "codes[0].code",
  "message": "O código deve conter apenas números e ter entre 8 e 11 dígitos"
}
```

### **Response Error - 422 Unprocessable Entity**

```json
{
  "error": "Validação falhou",
  "errors": {
    "codes[0].code": ["O código deve ter entre 8 e 11 dígitos"],
    "codes[1].code": ["O código é obrigatório"]
  }
}
```

### **Response Error - 429 Too Many Requests**

```json
{
  "error": "Muitas requisições",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after_seconds": 60
}
```

**Headers:**
```http
Retry-After: 60
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1732632000
```

---

## 📖 2. Listar Códigos (Paginado)

### **Endpoint**
```
GET /api/codes
```

### **Query Parameters**

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `page` | number | Não | 1 | Número da página |
| `limit` | number | Não | 10 | Itens por página |
| `status` | string | Não | "all" | Filtro: `all`, `pending`, `confirmed`, `error`, `not_found` |

### **Request Examples**

#### Cenário 1: Listar primeira página (padrão)
```http
GET /api/codes?page=1&limit=10&status=all
Authorization: Bearer {access_token}
```

#### Cenário 2: Listar apenas códigos confirmados
```http
GET /api/codes?page=1&limit=10&status=confirmed
Authorization: Bearer {access_token}
```

#### Cenário 3: Listar segunda página com 20 itens
```http
GET /api/codes?page=2&limit=20&status=all
Authorization: Bearer {access_token}
```

### **Response Success - 200 OK**

```json
{
  "codes": [
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440001",
      "code": "123456789",
      "name": "Consulta com Cardiologista",
      "status": "confirmed",
      "lastUpdated": "2024-11-26T10:35:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440002",
      "code": "987654321",
      "name": "Exame de Sangue",
      "status": "pending",
      "lastUpdated": "2024-11-26T10:30:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440003",
      "code": "555555555",
      "name": null,
      "status": "not_found",
      "lastUpdated": "2024-11-26T10:31:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

### **Response - Lista vazia**

```json
{
  "codes": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "hasMore": false
}
```

### **Response Error - 400 Bad Request**

```json
{
  "error": "Parâmetro inválido",
  "field": "status",
  "message": "Status deve ser: all, pending, confirmed, error, not_found"
}
```

---

## 🗑️ 3. Deletar Código

### **Endpoint**
```
DELETE /api/codes/{codeId}
```

### **Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `codeId` | string (UUID) | ID do código a deletar |

### **Request Example**

```http
DELETE /api/codes/code_550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer {access_token}
```

### **Response Success - 200 OK**

```json
{
  "success": true,
  "message": "Código deletado com sucesso"
}
```

### **Response Error - 404 Not Found**

```json
{
  "error": "Código não encontrado",
  "code": "CODE_NOT_FOUND"
}
```

### **Response Error - 403 Forbidden**

```json
{
  "error": "Sem permissão para deletar este código",
  "code": "FORBIDDEN"
}
```

---

## 🔄 4. Atualizar Status Manualmente

### **Endpoint**
```
POST /api/codes/update-now
```

### **Descrição**
Força atualização de status de todos os códigos do usuário no sistema externo.

### **Request**

```http
POST /api/codes/update-now
Authorization: Bearer {access_token}
```

**Body:** vazio

### **Response Success - 200 OK**

```json
{
  "success": true,
  "updated": [
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440001",
      "code": "123456789",
      "name": "Consulta com Cardiologista",
      "status": "confirmed",
      "lastUpdated": "2024-11-26T10:40:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "id": "code_550e8400-e29b-41d4-a716-446655440002",
      "code": "987654321",
      "name": "Exame de Sangue",
      "status": "error",
      "lastUpdated": "2024-11-26T10:40:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "message": "2 código(s) atualizado(s)"
}
```

### **Response - Nenhuma mudança**

```json
{
  "success": true,
  "updated": [],
  "message": "Nenhuma atualização necessária"
}
```

### **Response Error - 429 Too Many Requests**

```json
{
  "error": "Muitas requisições de atualização",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after_seconds": 300
}
```

**Headers:**
```http
Retry-After: 300
X-RateLimit-Limit: 1
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1732632300
```

---

## 📊 Status dos Códigos

### **Tipos de Status**

| Status | Descrição | Cor Frontend |
|--------|-----------|--------------|
| `pending` | Aguardando verificação | Amarelo |
| `confirmed` | Consulta confirmada | Verde |
| `error` | Erro ao verificar | Vermelho |
| `not_found` | Código não encontrado no sistema | Cinza |

### **Fluxo de Status**

```
pending → (verificação automática) → confirmed / error / not_found
                ↓
        (botão "Atualizar Agora")
                ↓
        confirmed / error / not_found
```

---

## 🚨 Erros Comuns

### **1. Token Expirado (401)**

```json
{
  "error": "Token expirado",
  "code": "TOKEN_EXPIRED",
  "reason": "expired"
}
```

**Ação do Frontend:** Chamar `/auth/refresh` com refresh_token

---

### **2. Rate Limit (429)**

```json
{
  "error": "Muitas requisições",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after_seconds": 60
}
```

**Headers:**
```http
Retry-After: 60
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1732632000
```

**Ação do Frontend:** 
- Mostrar mensagem: "Aguarde 60 segundos antes de tentar novamente"
- Desabilitar botão com countdown

---

### **3. Validação (422)**

```json
{
  "error": "Validação falhou",
  "errors": {
    "codes[0].code": ["O código deve ter entre 8 e 11 dígitos"],
    "codes[0].name": ["Nome deve ter no máximo 100 caracteres"]
  }
}
```

**Ação do Frontend:** Mostrar erros nos campos correspondentes

---

### **4. Servidor Indisponível (503)**

```json
{
  "error": "Serviço temporariamente indisponível",
  "code": "SERVICE_UNAVAILABLE"
}
```

**Ação do Frontend:** 
- Mostrar mensagem: "Sistema temporariamente indisponível. Tente novamente em alguns instantes."
- Botão "Tentar Novamente"

---

## 🔄 Atualização Automática de Status

### **Webhook (Opcional)**

Se o backend implementar webhooks, pode notificar o frontend quando um status mudar:

```
POST /api/webhook/code-status-updated
Authorization: Bearer {webhook_secret}
```

**Body:**
```json
{
  "userId": "user_550e8400-e29b-41d4-a716-446655440000",
  "codeId": "code_550e8400-e29b-41d4-a716-446655440001",
  "code": "123456789",
  "oldStatus": "pending",
  "newStatus": "confirmed",
  "timestamp": "2024-11-26T10:40:00.000Z"
}
```

**Frontend:** Pode usar WebSocket ou polling para atualizar em tempo real.

---

## 📦 Resumo de Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/codes` | Adicionar código(s) | ✅ |
| GET | `/api/codes` | Listar códigos (paginado) | ✅ |
| DELETE | `/api/codes/{codeId}` | Deletar código | ✅ |
| POST | `/api/codes/update-now` | Forçar atualização de status | ✅ |

---

## 🎯 Cenários de Teste

### **Cenário 1: Primeiro código do usuário**

**Request:**
```json
POST /api/codes
{
  "codes": [
    {
      "code": "123456789",
      "name": "Minha primeira consulta"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "added": [
    {
      "id": "code_...",
      "code": "123456789",
      "name": "Minha primeira consulta",
      "status": "pending",
      "lastUpdated": "2024-11-26T10:30:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_..."
    }
  ],
  "invalid": [],
  "message": "1 código(s) adicionado(s) com sucesso"
}
```

---

### **Cenário 2: Código duplicado**

**Request:**
```json
POST /api/codes
{
  "codes": [
    {
      "code": "123456789"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "added": [],
  "invalid": ["123456789 (já existe)"],
  "message": "0 código(s) adicionado(s) com sucesso"
}
```

**Frontend:** Mostra Alert warning com "Alguns códigos não puderam ser adicionados: 123456789 (já existe)"

---

### **Cenário 3: Código inválido (menos de 8 dígitos)**

**Request:**
```json
POST /api/codes
{
  "codes": [
    {
      "code": "1234567"
    }
  ]
}
```

**Response:**
```json
{
  "error": "Validação falhou",
  "errors": {
    "codes[0].code": ["O código deve ter entre 8 e 11 dígitos"]
  }
}
```

**Frontend:** Mostra Alert error com "O código deve ter entre 8 e 11 dígitos"

---

### **Cenário 4: Listar códigos sem nenhum cadastrado**

**Request:**
```http
GET /api/codes?page=1&limit=10&status=all
```

**Response:**
```json
{
  "codes": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "hasMore": false
}
```

**Frontend:** Mostra empty state com mensagem "Nenhum código encontrado"

---

### **Cenário 5: Filtrar apenas códigos confirmados**

**Request:**
```http
GET /api/codes?page=1&limit=10&status=confirmed
```

**Response:**
```json
{
  "codes": [
    {
      "id": "code_...",
      "code": "123456789",
      "name": "Consulta Cardiologista",
      "status": "confirmed",
      "lastUpdated": "2024-11-26T10:35:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "hasMore": false
}
```

---

### **Cenário 6: Atualizar status manualmente**

**Request:**
```http
POST /api/codes/update-now
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "updated": [
    {
      "id": "code_...",
      "code": "123456789",
      "name": "Consulta Cardiologista",
      "status": "confirmed",
      "lastUpdated": "2024-11-26T10:40:00.000Z",
      "createdAt": "2024-11-26T10:30:00.000Z",
      "userId": "user_..."
    }
  ],
  "message": "1 código(s) atualizado(s)"
}
```

**Frontend:** 
- Mostra Alert success: "1 código(s) atualizado(s)"
- Recarrega lista de códigos automaticamente

---

### **Cenário 7: Rate limit ao atualizar muito rápido**

**Request:**
```http
POST /api/codes/update-now
(chamado 3x em 10 segundos)
```

**Response (3ª tentativa):**
```json
{
  "error": "Muitas requisições de atualização",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after_seconds": 300
}
```

**Headers:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 300
X-RateLimit-Limit: 2
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1732632300
```

**Frontend:**
- Mostra Alert error: "Aguarde 5 minutos antes de atualizar novamente"
- Desabilita botão "Atualizar Agora" com countdown

---

## 🎨 Frontend - Fluxo de Telas

### **DashboardPage (Adicionar Código)**

1. Usuário digita código (8-11 dígitos)
2. Opcional: adiciona nome/descrição
3. Clica "Adicionar Código"
4. Frontend valida:
   - Código não vazio
   - Código numérico
   - Código entre 8-11 dígitos
5. Envia `POST /api/codes`
6. Se sucesso:
   - Mostra Alert success
   - Limpa formulário
   - Redireciona para CodesPage (opcional)
7. Se erro:
   - Mostra Alert error com mensagem

### **CodesPage (Lista de Códigos)**

1. Carrega `GET /api/codes?page=1&limit=10&status=all`
2. Mostra tabela com códigos
3. Usuário pode:
   - Filtrar por status (dropdown)
   - Paginar (botões anterior/próximo)
   - Deletar código (botão trash)
   - Atualizar status (botão "Atualizar Agora")
4. Ao deletar:
   - Confirma com modal
   - Envia `DELETE /api/codes/{id}`
   - Remove da lista localmente
5. Ao atualizar:
   - Desabilita botão
   - Envia `POST /api/codes/update-now`
   - Recarrega lista

---

## 💡 Observações Importantes

### **Rate Limiting**
- Adicionar códigos: 10 requisições/minuto
- Atualizar status: 1 requisição a cada 5 minutos
- Listar códigos: 60 requisições/minuto

### **Validações**
- Código: 8-11 dígitos numéricos
- Nome: máximo 100 caracteres (opcional)
- Duplicados: verificar por usuário + código

### **Segurança**
- Todos os endpoints requerem autenticação
- Usuário só pode ver/modificar seus próprios códigos
- Token JWT com expiração de 15 minutos

### **Performance**
- Paginação obrigatória na listagem
- Cache de lista no frontend (Zustand)
- Debounce em filtros/busca

---

## 📚 Referências

- **Auth API:** `openapiBackEnd.yaml` (https://auth.pixelaria.com.br)
- **Frontend Store:** `src/stores/codesStore.ts`
- **Frontend Service:** `src/services/codesService.ts`
- **Frontend Types:** `src/types/index.ts`
