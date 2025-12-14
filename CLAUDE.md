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
| Schema | Prototype first | Prisma schema BEFORE prototype |
| Mobile back | No back button | `<TopBar back={goBack}>` on every screen (except home) |
| TOML first | Write TSX directly | Create `src/spec/layers/components/*.toml` first |

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
```

## Don't Modify

- `core/` — engine code
- `dist/` — build output
