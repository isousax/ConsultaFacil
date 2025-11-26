# Integração com API de Autenticação - Documentação

## ✅ Implementação Concluída

Integração completa do frontend ConsultaFácil com a **Auth Engine API** (baseado na especificação OpenAPI fornecida).

---

## 📋 O Que Foi Implementado

### 1. **Tipos TypeScript Atualizados** (`src/types/index.ts`)

Novos tipos baseados na API real:

- `LoginResponse` - Inclui `access_token`, `refresh_token`, `expires_in`, `remember_me`
- `RegisterRequest` - Com campos `full_name`, `phone`, `birth_date`
- `RefreshTokenResponse` - Para rotação de tokens
- `JWTPayload` - Estrutura do payload JWT
- `ErrorResponse`, `AuthError`, `RateLimitError` - Tratamento de erros
- Requests para todas as operações: verificação de email, reset de senha, change password

### 2. **Serviço de Autenticação** (`src/services/authService.ts`)

Substituição completa do mock por chamadas reais à API:

- ✅ `register()` - POST /auth/register
- ✅ `login()` - POST /auth/login
- ✅ `logout()` - POST /auth/logout
- ✅ `refresh()` - POST /auth/refresh (com token rotation)
- ✅ `resendVerification()` - POST /auth/resend-verification
- ✅ `confirmVerification()` - POST /auth/confirm-verification
- ✅ `requestPasswordReset()` - POST /auth/request-reset
- ✅ `resetPassword()` - POST /auth/reset-password
- ✅ `changePassword()` - POST /auth/change-password
- ✅ `getProfile()` - GET /auth/me
- ✅ `updateProfile()` - PUT /auth/profile
- ✅ `introspectToken()` - POST /auth/introspect

### 3. **Cliente API Atualizado** (`src/services/api.ts`)

Melhorias no cliente Axios:

#### Rate Limiting (429)
- Detecta headers `X-RateLimit-*`
- Lê `Retry-After` header
- Retorna erro amigável com tempo de espera

#### Auto-Refresh de Tokens (401)
- Intercepta erros 401
- Tenta refresh automático com `refresh_token`
- Implementa **token rotation** (novo refresh_token após refresh)
- Evita loops infinitos de refresh
- Suporta requisições concorrentes (fila de espera)
- Redireciona para login se refresh falhar

### 4. **Store de Autenticação** (`src/stores/authStore.ts`)

Funcionalidades avançadas:

#### Gerenciamento de Tokens
- Armazena `access_token`, `refresh_token`, `tokenExpiresAt`
- Auto-refresh **2 minutos antes** da expiração
- Timer automático com `setTimeout`
- Limpeza de timers no logout

#### Novos Métodos
- `register()` - Substitui `signup()`
- `refreshTokens()` - Refresh manual de tokens
- `scheduleTokenRefresh()` - Agenda próximo refresh
- `changePassword()` - Troca de senha autenticado
- `updateProfile()` - Atualiza dados do perfil
- `refreshProfile()` - Recarrega dados do usuário

#### Fluxo de Login/Register
```typescript
1. Chama API (login/register)
2. Recebe access_token, refresh_token, expires_in
3. Calcula timestamp de expiração
4. Busca perfil completo (GET /auth/me)
5. Armazena tudo no localStorage
6. Agenda auto-refresh
```

### 5. **Novas Páginas de Autenticação**

#### ✅ Verificação de Email

**`VerifyEmailPage`** (`/verify-email?token=UUID`)
- Lê token UUID da URL
- Chama API para confirmar email
- Mostra sucesso/erro com ícones
- Redireciona para login após confirmação

**`ResendVerificationPage`** (`/resend-verification`)
- Formulário com campo de email
- Envia novo email de verificação
- Aviso sobre cooldown de 60 segundos

#### ✅ Reset de Senha

**`ForgotPasswordPage`** (`/forgot-password`)
- Formulário para solicitar reset
- Sempre retorna sucesso (evita enumeração de emails)
- Rate limit: 3 requisições/5 minutos

**`ResetPasswordPage`** (`/reset-password?token=UUID`)
- Lê token UUID da URL
- Formulário com nova senha + confirmação
- Validação de requisitos de senha
- Mostra/esconde senha com ícone de olho
- Redireciona automaticamente para login após sucesso

#### ✅ Alteração de Senha (Autenticado)

**`ChangePasswordPage`** (`/dashboard/change-password`)
- Requer senha atual
- Valida nova senha (mesmos requisitos)
- Verifica se nova senha é diferente da atual
- Protegida por rota autenticada

### 6. **Formulários de Login/Signup Atualizados**

#### LoginPage
- ✅ Checkbox "Manter conectado" (`remember_me`)
  - Marcado: refresh token válido por **30 dias**
  - Desmarcado: válido por **7 dias**
- ✅ Link "Esqueceu a senha?" → `/forgot-password`
- ✅ Validação mínima de 8 caracteres

#### SignupPage
- ✅ Campo `full_name` (3-100 caracteres)
- ✅ Campo `phone` (formato +55 XX XXXXX-XXXX)
- ✅ Campo `birth_date` (opcional, mínimo 18 anos)
- ✅ Validação robusta de senha:
  - Mínimo 8 caracteres
  - 1 letra maiúscula
  - 1 letra minúscula
  - 1 número
  - 1 caractere especial
- ✅ Informação visual dos requisitos

### 7. **Rotas Atualizadas** (`src/App.tsx`)

Novas rotas públicas:
```typescript
/verify-email        → VerifyEmailPage
/resend-verification → ResendVerificationPage
/forgot-password     → ForgotPasswordPage
/reset-password      → ResetPasswordPage
```

Nova rota protegida:
```typescript
/dashboard/change-password → ChangePasswordPage
```

### 8. **Sidebar Atualizada**

Novo item de menu:
- 🔑 **Alterar Senha** → `/dashboard/change-password`

---

## 🔐 Segurança Implementada

### Rate Limiting
- Detecção de headers `X-RateLimit-Limit/Remaining/Reset`
- Tratamento de erro 429 com `Retry-After`
- Mensagens amigáveis ao usuário

### Token Management
- Access token com refresh automático
- Refresh token com rotação (novo token a cada refresh)
- Armazenamento seguro no localStorage
- Limpeza completa no logout
- Timer para refresh preventivo (2 min antes)

### Validação de Senhas
```typescript
✅ Mínimo 8 caracteres
✅ 1 letra maiúscula
✅ 1 letra minúscula  
✅ 1 número
✅ 1 caractere especial (!@#$%^&*(),.?":{}|<>)
```

### Proteção de Rotas
- ProtectedRoute verifica autenticação
- Redireciona para `/login` se não autenticado
- Carrega auth do localStorage ao iniciar

---

## 🌐 Configuração da API

### Variável de Ambiente

Adicione ao `.env`:
```env
VITE_API_URL=https://auth.pixelaria.com.br
```

**Padrão:** `https://auth.pixelaria.com.br` (conforme OpenAPI spec)

### Endpoints Usados

```
POST   /auth/login                  # Login
POST   /auth/register               # Registro
POST   /auth/logout                 # Logout
POST   /auth/refresh                # Refresh token
POST   /auth/resend-verification    # Reenviar email
POST   /auth/confirm-verification   # Confirmar email
POST   /auth/request-reset          # Solicitar reset senha
POST   /auth/reset-password         # Resetar senha
POST   /auth/change-password        # Alterar senha (auth)
GET    /auth/me                     # Perfil do usuário
PUT    /auth/profile                # Atualizar perfil
POST   /auth/introspect             # Validar token
GET    /auth/.well-known/jwks.json  # Chaves públicas JWT
```

---

## 📱 Fluxos Completos

### 1. Registro + Verificação de Email
```
1. Usuário preenche formulário de signup
2. POST /auth/register
3. Recebe access_token + refresh_token
4. Sistema busca perfil (GET /auth/me)
5. Usuário recebe email com link
6. Clica no link → /verify-email?token=UUID
7. POST /auth/confirm-verification
8. Email confirmado ✅
```

### 2. Login com Remember Me
```
1. Usuário marca "Manter conectado"
2. POST /auth/login { remember_me: true }
3. Refresh token válido por 30 dias (vs 7 dias)
4. Sistema agenda auto-refresh
5. Token renovado automaticamente antes de expirar
```

### 3. Esqueci Minha Senha
```
1. Usuário clica "Esqueceu a senha?"
2. /forgot-password - digita email
3. POST /auth/request-reset
4. Recebe email com link
5. Clica → /reset-password?token=UUID
6. Define nova senha
7. POST /auth/reset-password
8. Redireciona para login ✅
```

### 4. Troca de Senha (Autenticado)
```
1. Usuário vai em /dashboard/change-password
2. Preenche senha atual + nova senha
3. POST /auth/change-password
4. Senha alterada ✅
```

---

## 🛠️ Como Testar

### 1. Configurar URL da API
```bash
echo "VITE_API_URL=https://auth.pixelaria.com.br" > .env
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar Dev Server
```bash
npm run dev
```

### 4. Testar Fluxos

#### Registro
1. Acesse `/signup`
2. Preencha todos os campos
3. Verifique se o token foi salvo no localStorage
4. Confirme redirecionamento para `/dashboard`

#### Login com Remember Me
1. Acesse `/login`
2. Marque "Manter conectado"
3. Faça login
4. Verifique `refresh_token` no localStorage

#### Verificação de Email
1. Simule URL: `/verify-email?token=550e8400-e29b-41d4-a716-446655440000`
2. Verifique chamada à API

#### Reset de Senha
1. `/forgot-password` → Digite email
2. `/reset-password?token=UUID` → Nova senha
3. Verifique redirecionamento

#### Auto-Refresh de Tokens
1. Faça login
2. Abra DevTools → Console
3. Após 58 minutos (token de 1h), veja log "Auto-refreshing token..."
4. Verifique novos tokens no localStorage

---

## 📝 Notas Importantes

### Diferenças do Mock Anterior

| Antes (Mock) | Agora (API Real) |
|--------------|------------------|
| `name` | `full_name` |
| `signup()` | `register()` |
| `token` | `access_token` + `refresh_token` |
| Sem expiração | `expires_in` (segundos) |
| Sem rate limit | Headers X-RateLimit-* |
| Sem refresh | Auto-refresh 2 min antes |
| localStorage direto | Busca perfil via GET /auth/me |

### Backward Compatibility

Aliases criados para compatibilidade:
```typescript
export type SignupRequest = RegisterRequest;
export type AuthResponse = LoginResponse;
```

### Tratamento de Erros

Todos os endpoints tratam:
- ✅ `ErrorResponse` (campos inválidos)
- ✅ `AuthError` (token inválido/expirado)
- ✅ `RateLimitError` (limite excedido)

---

## 🚀 Próximos Passos

### Melhorias Sugeridas

1. **Perfil do Usuário**
   - Página `/dashboard/profile`
   - Editar `full_name`, `display_name`, `phone`, `birth_date`
   - Usar `updateProfile()` do authStore

2. **Notificações Toast**
   - Biblioteca como `react-hot-toast`
   - Mostrar mensagens de rate limit
   - Feedback de auto-refresh

3. **Loading States**
   - Skeleton durante auto-refresh
   - Indicador visual no header

4. **Testes Automatizados**
   - Unit tests para authStore
   - Integration tests para fluxos completos
   - Mock MSW para API

5. **Analytics**
   - Track de eventos de login/register
   - Monitorar taxa de verificação de email
   - Dashboar de rate limiting

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique URL da API no `.env`
2. Confirme que backend está online
3. Verifique console do navegador (erros da API)
4. Limpe localStorage: `localStorage.clear()`
5. Reinicie dev server: `npm run dev`

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript atualizados
- [x] authService com todos os endpoints
- [x] Cliente API com rate limiting
- [x] Auto-refresh de tokens
- [x] Token rotation
- [x] Páginas de verificação de email
- [x] Páginas de reset de senha
- [x] Página de change password
- [x] Formulários de login/signup atualizados
- [x] Rotas configuradas
- [x] Sidebar atualizada
- [x] Validação de senha robusta
- [x] Remember me funcional
- [x] Tratamento de erros completo
- [x] Documentação criada

---

**Implementação completa! 🎉**

Todas as funcionalidades da Auth Engine API foram integradas ao frontend ConsultaFácil.
