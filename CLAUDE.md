# LLM Boilerplate - Claude Instructions

## What Is This?

LLM Boilerplate is a file-driven specification system for LLM-assisted development. You guide users from idea to working prototype through structured dialogue.

**Your Role:** Interview the user about their project, create TOML specifications in `src/spec/layers/`, and generate a React prototype.

## Architecture: Core vs Prototype

### Правило разделения

| Критерий | Ядро (`core/`) | Прототип (`src/prototype/`) |
|----------|----------------|----------------------------|
| **LLM меняет?** | НЕТ, только использует | ДА, создаёт/редактирует |
| **Назначение** | Инструменты | Бизнес-логика проекта |

### Ядро (`core/`) - НЕ МЕНЯТЬ

Инструменты и инфраструктура для построения прототипов:

```
core/app/src/
├── components/
│   ├── ui/           # UI Kit (60+ компонентов)
│   ├── mobile/       # Mobile компоненты (20+)
│   ├── documented/   # Doc компонент
│   └── renderers/    # Рендеры документации
├── hooks/
│   ├── useRepo.ts    # CRUD с localStorage
│   ├── useAuth.ts    # Универсальная авторизация
│   └── useForm.ts    # Обёртка react-hook-form
├── lib/
│   ├── repository.ts # Хранилище данных
│   ├── data-factory.ts # Генерация фейков
│   └── events.ts     # Система событий
└── pages/            # Страницы ядра (Home, Docs, UIKit, Prototype)
```

### Прототип (`src/prototype/`) - LLM СОЗДАЁТ

Бизнес-логика конкретного проекта:

```
src/prototype/
├── pages/            # Страницы проекта (Users.tsx, Products.tsx, Login.tsx)
├── mocks/            # JSON данные проекта
├── stores/           # Zustand сторы проекта (если нужны)
├── factories/        # Фабрики данных проекта
└── components/       # Кастомные компоненты проекта (НЕ ui!)
```

## Quick Start (Do This First!)

1. **Read `src/spec/status.toml`** — check `currentPhase` and `profile`
2. **Read `src/spec/interview.toml`** — check answers for current phase
3. **Determine state:**
   - If `currentPhase = "assessment"` and all phases `pending` → **Fresh project, start from scratch**
   - If some phases `completed` → **Continue from `currentPhase`**
   - If interview has empty fields for current phase → **Ask those questions**
4. **Read `rules/challenge.md`** — full workflow details

## Fresh Project Flow

When user describes a new project idea:

```
User: "I want to build a task manager app"

You: "Great! Let me ask a few questions to understand the scope:
1. What type of project? (web-app, mobile, api, landing)
2. How many user roles? (single user, 2-3 roles, many roles)
3. Data complexity? (simple CRUD, relational, complex)
4. External integrations needed?
5. Single app or multiple platforms (web + mobile + admin)?"

[Based on answers → select profile: simple/medium/complex]
[Update status.toml → profile, currentPhase = "discovery"]
[Continue to Discovery phase questions...]
```

## Phase-by-Phase Actions

| Phase | Your Action | Output |
|-------|-------------|--------|
| Assessment | Ask scope questions, select profile | Update `status.toml`, `interview.toml` |
| Discovery | Ask "what/who/why" questions | Update `interview.toml`, create `layers/project/about.toml` |
| Design | Ask visual/UX preferences | Update `interview.toml`, create `layers/project/design.toml` |
| Access | Ask about roles and permissions | Update `interview.toml`, create `layers/roles/*.toml` |
| Data | Ask about entities and fields | Update `interview.toml`, create `layers/entities/*.toml` |
| Features | Ask about screens and actions | Update `interview.toml`, create `layers/routes/*.toml`, `layers/use-cases/*.toml` |
| Schema | Generate Prisma schema | Create `prisma/schema.prisma` |
| Prototype | Generate React code | Create `src/prototype/pages/*.tsx` |

**IMPORTANT:** Schema phase comes BEFORE Prototype. This is schema-first approach: define data contracts before building UI.

## Prototype Tools (USE THESE!)

### UI Components - импорт из ядра

```tsx
import {
  Button, Card, Input, Badge,
  DataTable, Modal, Tabs,
  // ... 60+ компонентов
} from '@/components/ui'
```

### useRepo - CRUD with persistence

```tsx
import { useRepo } from '@/hooks/useRepo'

const users = useRepo<User>('users')

// State
users.data          // T[]
users.loading       // boolean
users.count         // number

// CRUD
users.create({ name: 'John', email: '...' })
users.update(id, { name: 'Jane' })
users.delete(id)

// Fake data
users.populate(20)
```

### useAuth - универсальная авторизация

```tsx
import { useAuth } from '@/hooks/useAuth'

// Определи тип пользователя
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

// Используй
const { user, isAuthenticated, login, logout, hasRole } = useAuth<User>()

// Login
login({ id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' })

// Check
if (hasRole('admin')) { ... }

// Logout
logout()
```

### registerFactory - fake data

```tsx
import { registerFactory, faker } from '@/hooks/useRepo'

registerFactory<User>('users', () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'user']),
}))
```

## Добавление страниц прототипа

1. **Создай страницу** в `src/prototype/pages/`:
   ```
   src/prototype/pages/Orders.tsx
   src/prototype/pages/admin/Dashboard.tsx
   ```

2. **Добавь роут** в `core/app/src/pages/Prototype.tsx`:
   ```tsx
   import OrdersPage from '@prototype/pages/Orders'

   // В PrototypePage():
   if (location.pathname === '/prototype/orders') {
     return <OrdersPage />
   }
   ```

3. **Добавь карточку** в PrototypeHome (опционально):
   ```tsx
   const pages = [
     { path: '/prototype/orders', title: 'Orders', icon: ShoppingCart },
   ]
   ```

## Key Paths

- `src/spec/status.toml` - current phase, progress tracking
- `src/spec/interview.toml` - questions and answers for each phase
- `src/spec/layers/` - TOML specs (project, entities, roles, routes, use-cases, knowledge)
- `src/prototype/` - React prototype code
- `rules/challenge.md` - full workflow instructions

## Rules

- `rules/challenge.md` - adaptive workflow (READ THIS)
- `rules/layers.md` - layer structure reference
- `rules/patterns.md` - code patterns (Doc component, events, page building)
- `rules/prototype.md` - prototype development (useRepo, factories, linking to docs)
- `rules/docs-pdf.md` - PDF documentation, MCP integration, manifest
- `rules/web.md` - web-specific
- `rules/mobile.md` - mobile-specific

## LLM/RAG Integration

All project specifications are available as unified manifest:

- **URL:** `/generated/manifest.json`
- **Dev:** `http://localhost:5173/generated/manifest.json`

Contains all layers (entities, components, routes, etc.) with `_meta.path` for source tracing.

## Don't Modify

- `core/` - engine code (UI kit, hooks, lib)
- `dist/` - build output
