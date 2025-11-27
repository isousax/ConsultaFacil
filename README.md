# ConsultaFácil

## 📋 Sobre o Projeto

**ConsultaFácil** é um sistema web completo para gerenciamento e acompanhamento automático de códigos de consultas médicas. A aplicação permite que usuários salvem múltiplos códigos numéricos e monitorem automaticamente o status de cada consulta, eliminando a necessidade de verificar manualmente cada código em sistemas separados.

## 🎯 Problema que Resolvemos

Muitas pessoas enfrentam dificuldades ao tentar acompanhar o status de várias consultas médicas simultaneamente:

- ⏰ **Tempo perdido**: Verificar manualmente cada código em diferentes sistemas
- 😤 **Frustração**: Não saber quando o status muda sem verificar constantemente
- 📝 **Desorganização**: Perder códigos importantes ou esquecer de verificar

O ConsultaFácil centraliza todos os códigos em uma única plataforma, verificando automaticamente o status e mantendo você sempre informado.

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```

O site estará disponível em `http://localhost:5173`

## ✨ Funcionalidades

### Autenticação
- ✅ Cadastro de usuário com nome, e-mail e senha
- ✅ Login seguro com validação
- ✅ Persistência de sessão (localStorage)
- ✅ Rotas protegidas para usuários autenticados

### Dashboard
- ✅ Adicionar código único (apenas números)
- ✅ Adicionar múltiplos códigos de uma vez (separados por vírgula ou quebra de linha)
- ✅ Validação em tempo real de códigos válidos/inválidos
- ✅ Feedback visual claro de sucesso/erro

### Gerenciamento de Códigos
- ✅ Listagem de todos os códigos salvos
- ✅ Status coloridos com badges (Pendente, Confirmado, Erro, Não Encontrado)
- ✅ Filtro por status
- ✅ Paginação de resultados
- ✅ Exibição de data de criação e última atualização
- ✅ Botão "Atualizar Agora" para forçar verificação
- ✅ Remover códigos individuais

### Interface e UX
- ✅ Design limpo e profissional
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Header com perfil do usuário
- ✅ Menu lateral no dashboard
- ✅ Loading states e skeletons
- ✅ Mensagens de erro/sucesso
- ✅ Página "Sobre" informativa
- ✅ Footer simples

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

### Roteamento e Estado
- **React Router DOM v7** - Roteamento SPA
- **Zustand** - Gerenciamento de estado global

### Estilização
- **Tailwind CSS v4** - Framework CSS utility-first
- **Lucide React** - Ícones
- **clsx** - Utility para classes condicionais

### Requisições HTTP
- **Axios** - Cliente HTTP com interceptors

### Qualidade de Código
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **TypeScript ESLint** - Regras específicas TS

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── ui/             # Componentes UI básicos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── Skeleton.tsx
│   └── ProtectedRoute.tsx  # Guard de rotas protegidas
│
├── pages/              # Páginas da aplicação
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardPage.tsx
│   │   └── CodesPage.tsx
│   ├── AboutPage.tsx
│   └── NotFoundPage.tsx
│
├── services/           # Serviços e API
│   ├── api.ts         # Cliente Axios configurado
│   ├── authService.ts # Serviços de autenticação
│   └── codesService.ts # Serviços de códigos
│
├── stores/            # Estado global Zustand
│   ├── authStore.ts
│   └── codesStore.ts
│
├── types/             # Definições TypeScript
│   └── index.ts
│
├── App.tsx            # Componente raiz com rotas
├── main.tsx          # Entry point
└── index.css         # Estilos globais
```

## 🧪 Testando a Aplicação

### Fluxo de Teste Básico

1. Acesse `/signup` e crie uma conta
2. Faça login com as credenciais criadas
3. No Dashboard, adicione alguns códigos:
   - Um código único: `123456789`
   - Múltiplos códigos: `111111111, 222222222, 333333333`
4. Navegue para "Meus Códigos"
5. Teste os filtros por status
6. Clique em "Atualizar Agora" para simular verificação
7. Remova um código
8. Faça logout

## 📱 Responsividade

O sistema é totalmente responsivo:
- 📱 **Mobile**: Menu lateral com overlay
- 📱 **Tablet**: Layout adaptado
- 💻 **Desktop**: Sidebar fixa, layout expandido

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

### Opções de Deploy

- **Vercel**: Conecte o repositório GitHub e faça deploy automático
- **Netlify**: Drag & drop da pasta `dist` ou deploy via CLI
- **AWS S3 + CloudFront**: Upload para S3 e configure CDN
- **Docker**: Containerize e deploy em qualquer plataforma

### Variáveis de Ambiente

Lembre-se de configurar as variáveis de ambiente no serviço de deploy:
```
VITE_API_URL=https://api.seuprojeto.com
```

## 🔌 Integração com Backend

### Mock API (Atual)

Atualmente, o sistema usa **mock services** que simulam chamadas de API utilizando `localStorage`. Todos os dados são armazenados localmente no navegador.

### Integração com Backend Real

Para integrar com um backend real, siga estes passos:

1. **Configure a URL da API**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://seu-backend.com/api
```

2. **Remova/comente o código mock nos services**

Nos arquivos `src/services/authService.ts` e `src/services/codesService.ts`, você encontrará comentários indicando a implementação real. Exemplo:

```typescript
// Mock implementation
// await new Promise((resolve) => setTimeout(resolve, 800));
// ... código mock ...

// Real implementation (descomente):
const response = await apiClient.post<AuthResponse>('/auth/signup', data);
return response.data;
```

3. **Endpoints Esperados pelo Frontend**

#### Autenticação

**POST** `/auth/signup`
```json
Request:
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}

Response:
{
  "user": {
    "id": "user_123",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**POST** `/auth/login`
```json
Request:
{
  "email": "joao@example.com",
  "password": "senha123"
}

Response:
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

**GET** `/auth/verify`
```
Headers: Authorization: Bearer {token}

Response:
{
  "id": "user_123",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Códigos

**POST** `/codes/add`
```json
Request:
{
  "codes": ["123456", "789012", "345678"]
}

Response:
{
  "success": true,
  "added": [
    {
      "id": "code_1",
      "code": "123456",
      "status": "pending",
      "lastUpdated": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "userId": "user_123"
    }
  ],
  "invalid": ["abc123"],
  "message": "2 código(s) adicionado(s) com sucesso"
}
```

**GET** `/codes/list?page=1&limit=10&status=all`
```json
Response:
{
  "codes": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

**DELETE** `/codes/:codeId`
```json
Response:
{
  "success": true,
  "message": "Código removido com sucesso"
}
```

**POST** `/codes/update-now`
```json
Response:
{
  "success": true,
  "updated": [...],
  "message": "10 código(s) atualizados"
}
```

4. **Autenticação com Token JWT**

O sistema já está configurado para enviar o token JWT automaticamente em todas as requisições através do interceptor do Axios (veja `src/services/api.ts`).

## 📝 Licença

Este projeto é de código aberto e está disponível para uso educacional e comercial.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ para facilitar sua vida**

## 📄 Licença

Propriedade da Pixelaria.

## 👥 Contato

- Email: contato@pixelaria.com.br
- WhatsApp: (81) 99272-0219

---

Desenvolvido com ❤️ pela equipe Pixelaria
