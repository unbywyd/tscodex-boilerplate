# Project Wizard - План реализации

## Обзор

**Задача:** Многошаговый визард для сбора проектных требований от клиентов/PM с интеграцией LLM.

**Контекст:**
- Часть существующей админки на Prisma ORM + REST API
- Клиент/PM получает публичную ссылку → заполняет → данные в админке
- LLM ведёт интервью в режиме ping-pong (вопрос-ответ)
- Без версионности, только актуальная версия
- **Без технических вопросов** (стек, архитектура) — только бизнес-требования

---

## 1. Схема БД (Prisma)

### Основные таблицы

```prisma
// ============================================================
// WIZARD: Главная таблица
// ============================================================
model ProjectWizard {
  id              String   @id @default(cuid())
  publicToken     String   @unique @default(cuid())  // для публичной ссылки
  accessCode      String?                            // опциональный код доступа
  status          WizardStatus @default(DRAFT)       // DRAFT | COMPLETED | ARCHIVED

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  completedAt     DateTime?
  expiresAt       DateTime?

  // Relations
  answers         WizardAnswer[]      // все ответы Q&A

  // Контекст (обновляется после каждого батча)
  contextJson     Json?               // структурированные факты о проекте

  // Финальный JSON (генерируется при завершении)
  exportedJson    Json?

  @@index([publicToken])
  @@index([status])
}

enum WizardStatus {
  DRAFT           // в процессе
  COMPLETED       // завершен
  ARCHIVED        // архивирован
}

// ============================================================
// Q&A: Вопросы и ответы (ping-pong)
// ============================================================
model WizardAnswer {
  id              String   @id @default(cuid())
  wizardId        String
  wizard          ProjectWizard @relation(fields: [wizardId], references: [id], onDelete: Cascade)

  // Вопрос
  question        String   @db.Text              // "Как называется ваш проект?"
  category        QuestionCategory              // PROJECT | AUDIENCE | FEATURES | ROLES | FLOW

  // Ответ (от LLM или пользователя)
  suggestedAnswer String?  @db.Text              // предложенный LLM ответ (может быть null)
  finalAnswer     String?  @db.Text              // финальный ответ (после правки юзером)

  // Статус
  status          AnswerStatus @default(PENDING) // PENDING | ACCEPTED | EDITED | SKIPPED
  isRelevant      Boolean  @default(true)        // false = "не релевантно"

  // Meta
  order           Int      @default(0)           // порядок в категории
  batchNumber     Int      @default(1)           // номер батча (1, 2, 3...)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([wizardId, category])
  @@index([wizardId, status])
}

enum QuestionCategory {
  PROJECT         // название, описание, проблема
  AUDIENCE        // целевая аудитория, пользователи
  PLATFORM        // web/mobile, односторонее/двустороннее
  ROLES           // типы пользователей
  FEATURES        // функционал, фичи
  FLOW            // user journey, сценарии
  BUSINESS        // монетизация, метрики
}

enum AnswerStatus {
  PENDING         // ожидает ответа (вопрос без suggested answer)
  SUGGESTED       // LLM предложил ответ, ждёт подтверждения
  ACCEPTED        // принят как есть
  EDITED          // отредактирован пользователем
  SKIPPED         // пропущен / не релевантен
}
```

---

## 2. Концепция: Ping-Pong Interview

### Принцип работы

```
┌─────────────────────────────────────────────────────────────┐
│  PING-PONG FLOW                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. LLM генерирует батч из 5 вопросов                       │
│     ├─ С ответами (если может предположить)                 │
│     └─ Без ответов (открытые вопросы)                       │
│                                                             │
│  2. Пользователь обрабатывает каждый:                       │
│     ├─ ✓ Принять (ответ правильный)                         │
│     ├─ ✎ Редактировать (поправить ответ)                    │
│     ├─ ✗ Не релевантно (пометить и скрыть)                  │
│     └─ [ввести] Написать ответ (если пустой)                │
│                                                             │
│  3. Кнопка "Ещё вопросы" → следующий батч                   │
│     └─ LLM учитывает все предыдущие ответы                  │
│                                                             │
│  4. Когда вопросы заканчиваются:                            │
│     └─ LLM возвращает пустой батч                           │
│     └─ Показываем "Завершить" / "Пропустить"                │
│                                                             │
│  5. Завершение → генерация финального JSON                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Типы вопросов

| Тип | Пример | LLM ответ |
|-----|--------|-----------|
| **С ответом** | "Это мобильное приложение?" | "Да, судя по описанию это мобильное приложение для iOS и Android" |
| **Без ответа** | "Какую проблему решает ваш продукт?" | `null` — пользователь должен написать |
| **Уточняющий** | "Вы упомянули водителей. Это как Uber — двустороннее приложение?" | "Да, двустороннее: водитель и пассажир" |

### UI карточки вопроса

```
┌────────────────────────────────────────────────────────────┐
│  Категория: ROLES                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Какие типы пользователей будут в приложении?              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Водители и пассажиры. Водители принимают заказы,     │  │
│  │ пассажиры создают заказы на поездку.                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↑ editable textarea                │
│                                                            │
│  [✓ Принять]  [✎ Редактирую]  [✗ Не релевантно]           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 3. LLM Интеграция (упрощённая)

### Один endpoint, один промт

```
POST /api/v1/wizard/:token/generate-questions
Body: { count: 5 }  // сколько вопросов в батче
Response: { questions: [...], hasMore: boolean }
```

### System Prompt

```
Ты — продуктовый аналитик, который помогает собрать требования к проекту.
Твоя задача: задавать вопросы и предлагать ответы на основе контекста.

ПРАВИЛА:
1. НЕ спрашивай про технический стек (React, Node.js, PostgreSQL и т.д.)
2. НЕ спрашивай про архитектуру и инфраструктуру
3. Фокусируйся на: проблема, аудитория, функционал, роли, сценарии
4. Если можешь предположить ответ — предложи его
5. Если не можешь — оставь suggestedAnswer: null
6. Не повторяй уже заданные вопросы
7. Когда вопросы закончились — верни пустой массив

КАТЕГОРИИ ВОПРОСОВ (по приоритету):
- PROJECT: название, суть, проблема
- AUDIENCE: кто пользователи, их боли
- PLATFORM: web/mobile, одно/двустороннее
- ROLES: типы пользователей, их задачи
- FEATURES: ключевые функции, MVP
- FLOW: основные сценарии использования
- BUSINESS: монетизация, метрики успеха

ФОРМАТ ОТВЕТА (JSON):
{
  "questions": [
    {
      "question": "Текст вопроса?",
      "category": "FEATURES",
      "suggestedAnswer": "Предполагаемый ответ или null"
    }
  ],
  "hasMore": true
}
```

### Сбор контекста (Story Building)

**Проблема:** Нельзя передавать все 30+ Q&A в каждый запрос — дорого и шумно.

**Решение:** Structured Context — извлекаем факты в JSON после каждого батча.

```prisma
model ProjectWizard {
  // ...
  contextJson     Json?    // структурированный контекст проекта
}
```

```typescript
interface ProjectContext {
  name?: string;
  problem?: string;
  audience?: string;
  platform?: 'web' | 'mobile' | 'desktop' | 'hybrid';
  appType?: 'single' | 'dual' | 'multi';
  sides?: string[];           // ['driver', 'passenger']
  roles?: string[];           // ['admin', 'user', 'guest']
  keyFeatures?: string[];
  monetization?: string;

  // Мета для LLM
  questionsAsked: string[];   // список уже заданных вопросов
  categoriesCovered: string[];
}
```

### Flow обновления контекста

```
1. Пользователь отвечает на батч
2. PATCH /answers/batch — сохраняем ответы
3. Бэкенд вызывает updateContext()
4. LLM извлекает факты → сохраняет в contextJson
5. Следующий generate-questions использует contextJson
```

### Промпт для извлечения фактов

```
Извлеки факты о проекте из Q&A.

Q&A:
${formatAnswers(newAnswers)}

Текущий контекст:
${JSON.stringify(currentContext)}

Обнови контекст новыми фактами. Верни полный JSON.
Не теряй старые факты, только дополняй.
```

### User Prompt для генерации вопросов

```
КОНТЕКСТ ПРОЕКТА:
${JSON.stringify(wizard.contextJson, null, 2)}

УЖЕ СПРАШИВАЛИ:
${context.questionsAsked.map(q => `- ${q}`).join('\n')}

Сгенерируй ${count} новых вопросов.
- Не повторяй уже заданные
- Фокусируйся на пробелах (null поля в контексте)
- Если всё заполнено — верни пустой массив
```

---

## 4. API Endpoints

### Wizard CRUD
```
POST   /api/v1/wizard                     # Создать визард
GET    /api/v1/wizard/:token              # Получить по токену
POST   /api/v1/wizard/:token/complete     # Завершить визард
DELETE /api/v1/wizard/:token              # Удалить (только если DRAFT)
```

### Q&A Flow
```
# Получить батч вопросов от LLM
POST   /api/v1/wizard/:token/questions/generate
Body:  { count: 5 }
Response: { questions: [...], hasMore: boolean }

# Получить все ответы
GET    /api/v1/wizard/:token/answers
Query: { category?: string, status?: string }

# Обновить ответ (принять/редактировать/пропустить)
PATCH  /api/v1/wizard/:token/answers/:answerId
Body:  {
  status: "ACCEPTED" | "EDITED" | "SKIPPED",
  finalAnswer?: string,    // если EDITED
  isRelevant?: boolean     // false для "не релевантно"
}

# Batch update (принять несколько сразу)
PATCH  /api/v1/wizard/:token/answers/batch
Body:  {
  updates: [
    { id: "...", status: "ACCEPTED" },
    { id: "...", status: "EDITED", finalAnswer: "..." }
  ]
}
```

### Экспорт
```
GET    /api/v1/wizard/:token/export       # JSON
GET    /api/v1/wizard/:token/summary      # Краткая сводка
```

### Админ
```
GET    /api/v1/wizard/admin/list          # Список всех
GET    /api/v1/wizard/admin/:id           # Детали
POST   /api/v1/wizard/admin/create-link   # Создать ссылку
```

---

## 5. Финальный JSON (экспорт)

```typescript
interface ProjectWizardExport {
  meta: {
    version: "1.0";
    exportedAt: string;
    wizardId: string;
    publicToken: string;
  };

  // Все Q&A сгруппированные по категориям
  answers: {
    project: Answer[];      // название, описание, проблема
    audience: Answer[];     // целевая аудитория
    platform: Answer[];     // web/mobile, dual/single
    roles: Answer[];        // типы пользователей
    features: Answer[];     // функционал
    flow: Answer[];         // сценарии
    business: Answer[];     // монетизация
  };

  // Статистика
  stats: {
    totalQuestions: number;
    answered: number;
    skipped: number;
    categories: Record<string, number>;  // вопросов по категориям
  };
}

interface Answer {
  question: string;
  answer: string;           // finalAnswer или suggestedAnswer
  wasEdited: boolean;       // true если пользователь редактировал
  isRelevant: boolean;
}
```

### Пример экспорта

```json
{
  "meta": {
    "version": "1.0",
    "exportedAt": "2025-01-15T10:30:00Z",
    "wizardId": "clx123abc",
    "publicToken": "proj_abc123def"
  },
  "answers": {
    "project": [
      {
        "question": "Как называется ваш проект?",
        "answer": "CargoGo",
        "wasEdited": false,
        "isRelevant": true
      },
      {
        "question": "Какую проблему решает ваш продукт?",
        "answer": "Малому бизнесу сложно быстро найти надёжного перевозчика для грузов",
        "wasEdited": true,
        "isRelevant": true
      }
    ],
    "platform": [
      {
        "question": "Это мобильное или веб-приложение?",
        "answer": "Мобильное приложение для iOS и Android",
        "wasEdited": false,
        "isRelevant": true
      },
      {
        "question": "Это двустороннее приложение (как Uber)?",
        "answer": "Да, есть заказчики (бизнес) и водители-перевозчики",
        "wasEdited": true,
        "isRelevant": true
      }
    ],
    "roles": [
      {
        "question": "Какие типы пользователей будут в приложении?",
        "answer": "Заказчик (создаёт заявки), Водитель (принимает заявки), Админ (модерация)",
        "wasEdited": false,
        "isRelevant": true
      }
    ],
    "features": [
      {
        "question": "Какие основные функции нужны заказчику?",
        "answer": "Создание заявки, отслеживание груза, оплата, история заказов, чат с водителем",
        "wasEdited": true,
        "isRelevant": true
      }
    ]
  },
  "stats": {
    "totalQuestions": 24,
    "answered": 22,
    "skipped": 2,
    "categories": {
      "project": 4,
      "audience": 3,
      "platform": 3,
      "roles": 4,
      "features": 6,
      "flow": 3,
      "business": 1
    }
  }
}
```

---

## 6. UI Flow

### Экраны

```
1. WELCOME
   └─ "Давайте соберём требования к вашему проекту"
   └─ [Начать]

2. Q&A SESSION (основной экран)
   ┌─────────────────────────────────────────┐
   │  Прогресс: ████████░░░░ 12 вопросов     │
   ├─────────────────────────────────────────┤
   │                                         │
   │  Батч вопросов (5 карточек)             │
   │  ┌─────────────────────────────────┐    │
   │  │ Q: Как называется проект?       │    │
   │  │ A: [________________]           │    │
   │  │ [✓] [✗ Не релевантно]           │    │
   │  └─────────────────────────────────┘    │
   │  ... ещё 4 карточки ...                 │
   │                                         │
   ├─────────────────────────────────────────┤
   │  [Ещё вопросы]  [Завершить]             │
   └─────────────────────────────────────────┘

3. COMPLETION
   └─ "Отлично! Собрано 24 ответа"
   └─ Превью JSON
   └─ [Скачать JSON] [Готово]
```

### Состояния кнопки "Ещё вопросы"

| Ситуация | Поведение |
|----------|-----------|
| LLM вернул `hasMore: true` | Кнопка активна |
| LLM вернул `hasMore: false` | Кнопка скрыта, показать "Завершить" |
| LLM вернул пустой массив | "Вопросы закончились" + "Завершить" |
| Ошибка LLM | "Попробовать снова" + "Завершить без новых" |

---

## 7. Технические детали

### Rate Limiting
- LLM запросы: 10 req/min на токен
- Публичный API: 100 req/min на IP

### Безопасность
- publicToken — для публичного доступа (ссылка клиенту)
- accessCode — опциональный пароль
- expiresAt — срок действия ссылки

### Автосохранение
- Каждый ответ сохраняется сразу при действии
- Нет кнопки "Сохранить" — всё автоматически

### Graceful Degradation
- Если LLM недоступен → показать ручной режим
- Ручной режим: фиксированные вопросы без AI

---

## 8. Файлы для реализации

| Файл | Описание |
|------|----------|
| `prisma/schema.prisma` | ProjectWizard + WizardAnswer |
| `src/modules/wizard/wizard.module.ts` | NestJS модуль |
| `src/modules/wizard/wizard.controller.ts` | REST endpoints |
| `src/modules/wizard/wizard.service.ts` | CRUD + export |
| `src/modules/wizard/llm.service.ts` | Генерация вопросов |
| `src/modules/wizard/dto/wizard.dto.ts` | DTO для API |

### Минимальный набор для MVP

1. **Prisma схема** — 2 таблицы
2. **Один LLM endpoint** — генерация батча вопросов
3. **CRUD для ответов** — принять/редактировать/пропустить
4. **Экспорт JSON** — сгруппированные ответы
