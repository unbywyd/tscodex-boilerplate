# LLM Boilerplate - Instructions

## ⚠️ STOP: Read Required Files First

**Before writing ANY code, read these files:**

| File | When to Read | What's Inside |
|------|--------------|---------------|
| `rules/prototype.md` | **ALWAYS** | UIKit usage, Doc wrappers, schema-first |
| `rules/mobile.md` | If `projectType = mobile` | App flow, navigation, onboarding |
| `rules/challenge.md` | For interview workflow | Phases, questions, TOML creation |
| `rules/layers.md` | For TOML structure | Entity, route, component specs |
| `rules/patterns.md` | For code patterns | Events, page building, Doc usage |

## Quick Rules (Non-Negotiable)

| Rule | ❌ Wrong | ✅ Correct |
|------|----------|------------|
| UIKit | `<button>`, `<input>` | `<Button>`, `<Input>` from `@/components/ui` |
| Doc wrapper | No wrapper | `<Doc of="components.name">` on business components |
| **Events** | `onClick={() => action()}` | `onClick={() => { action(); dispatchEvent('...') }}` |
| Schema | Prototype first | Prisma schema BEFORE prototype |
| Mobile back | No back button | `<TopBar back={goBack}>` on every screen (except home) |
| TOML first | Write TSX directly | Create `src/spec/layers/components/*.toml` first |

**⚠️ CRITICAL: Every user action (button click, form submit, toggle) MUST have `dispatchEvent()` describing what happens on backend.**

## Architecture

```
core/                    # ❌ DO NOT MODIFY
├── app/src/components/ui/  # UIKit (60+ components)
├── app/src/hooks/          # useRepo, useAuth, useForm
└── app/src/lib/            # repository, events, data-factory

src/prototype/           # ✅ LLM CREATES HERE
├── pages/               # Page components
├── components/          # Business components (with Doc wrappers)
├── stores/              # Zustand stores
├── factories/           # Data factories
└── mocks/               # JSON mock data

src/spec/                # ✅ LLM CREATES HERE
├── status.toml          # Current phase (read first!)
├── interview.toml       # User answers
└── layers/              # TOML specifications
    ├── entities/        # Data models
    ├── components/      # Component specs
    ├── routes/          # Page specs
    └── ...
```

## Workflow

1. **Read** `src/spec/status.toml` → check `currentPhase`
2. **Read** `src/spec/interview.toml` → check answers
3. **Follow** phase from `rules/challenge.md`
4. **Create** TOML specs in `src/spec/layers/`
5. **Generate** Prisma schema (if medium/complex)
6. **Generate** prototype with UIKit components

## Phase Order

```
Simple:   Assessment → Discovery → Data → Features → Prototype
Medium:   Assessment → Discovery → Design → Access → Data → Features → Schema → Prototype
Complex:  + Modules phase before Features
```

**Schema comes BEFORE Prototype** (schema-first approach).

## Prototype Phase = 3 Parallel Streams

```
For EACH component:
┌─────────────────────────────────────────────────┐
│ 1. TOML FIRST                                   │
│    └─ src/spec/layers/components/name.toml      │
│                                                 │
│ 2. TSX WITH DOC                                 │
│    └─ <Doc of="components.name" entityId={id}>  │
│                                                 │
│ 3. EVENTS ON ACTIONS                            │
│    └─ dispatchEvent('domain.action', {...})     │
└─────────────────────────────────────────────────┘
```

**All three are REQUIRED. Code without any of them = rejected.**

## Key Imports

```tsx
// UIKit components
import { Button, Card, Input, Badge, Dialog, Sheet } from '@/components/ui'

// Mobile components
import { Screen, ScreenHeader, ScreenBody, TopBar, BottomNav, MobileFrame } from '@/components/ui'

// Hooks
import { useRepo } from '@/hooks/useRepo'
import { useAuth } from '@/hooks/useAuth'

// Doc wrapper (for business components)
import { Doc } from '@/components/ui'

// Events (REQUIRED for every action)
import { dispatchEvent } from '@/lib/events'
```

## Event Pattern (Required)

```tsx
// Every action MUST dispatch an event describing backend behavior
const handleAddToCart = () => {
  cart.add(product)
  dispatchEvent('cart.item_added', {
    productId: product.id,
    message: 'Added to cart, stock reserved for 15 min'
  })
}
```

## Don't Modify

- `core/` — engine code
- `dist/` — build output
