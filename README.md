# LLM Boilerplate

File-driven specification system for LLM-assisted development. Define your project in TOML/Markdown, get documentation portal + working React prototype.

## What Makes It Unique?

### 1. Adaptive Algorithm
The system adapts to your project's complexity:
- **Simple** — Short workflow (5 phases) for landing pages, portfolios, basic CRUD
- **Medium** — Full workflow (8 phases) for SaaS, e-commerce, dashboards
- **Complex** — Module decomposition for ERP, marketplaces, enterprise apps

### 2. Single Source of Truth
All project knowledge lives in simple files (TOML/Markdown):
- Technical specifications
- Documentation
- Mock data
- Database schema

Change the spec → everything updates automatically.

### 3. LLM-Optimized Structure
The system guides LLM to ask the right questions at the right depth:
- Simple project = quick, shallow questions
- Complex project = deep, detailed questions

### 4. Three Outputs From One Source
From the same TOML files you get:
- **Documentation Portal** — browsable, organized docs
- **React Prototype** — working UI with mock data
- **Prisma Schema** — database-ready schema

---

## The Algorithm

### Phase 0: Assessment
Determine project complexity and choose profile.

Questions:
- Project type? (web-app, mobile, api...)
- How many user roles? (one, 2-3, many)
- Data complexity? (simple, relational, hierarchical)
- External integrations? (none, some, many)

**Decision:** System selects profile (Simple/Medium/Complex) and adjusts workflow.

### Phase 1: Discovery
Understand project fundamentals.

| Profile | Questions |
|---------|-----------|
| Simple | What is it? Who uses it? Main action? |
| Medium | Problem solved? Audience? Core value? Top 5 features? |
| Complex | + Business goals? Existing systems? Compliance? Scale? |

**Output:** `layers/project/about.toml`, `business.toml`

### Phase 2: Design (Medium/Complex only)
Define visual and UX requirements.

**Output:** `layers/project/design.toml`

### Phase 3: Access Control (if multiple roles)
Define who can do what.

**Output:** `layers/roles/*.toml`, `layers/guards/*.toml`

### Phase 4: Data Model
Define entities and relationships.

**Output:** `layers/entities/*.toml`

### Phase 5: Modules (Complex only)
Decompose large projects into domains.

**Output:** `layers/modules/*.toml`

### Phase 6: Features & Screens
Define user actions and interfaces.

**Output:** `layers/use-cases/*.toml`, `layers/routes/*.toml`, `layers/components/*.toml`

### Phase 7: Schema (Medium/Complex)
Generate Prisma database schema. **This comes BEFORE prototype** — schema-first approach ensures data contract is defined before UI.

**Output:** `prisma/schema.prisma`

### Phase 8: Prototype
Generate working React screens with mock data based on the schema.

**Output:** `src/prototype/pages/*.tsx`, `src/prototype/mocks/*.json`

---

## Workflow Profiles

```
Simple:   Assessment → Discovery → Data → Features → Prototype
Medium:   Assessment → Discovery → Design → Access → Data → Features → Schema → Prototype
Complex:  Assessment → Discovery → Design → Access → Data → Modules → Features → Schema → Prototype
```

**Schema-First:** For Medium/Complex profiles, Prisma schema is generated BEFORE the prototype to ensure data contracts are defined first.

---

## Project Structure

```
llm-boilerplate/
├── src/spec/                 # YOUR PROJECT SPECIFICATION
│   ├── layers/               # Structured TOML files
│   │   ├── project/          # about.toml, tech.toml, business.toml, design.toml
│   │   ├── entities/         # Data models (user.toml, product.toml)
│   │   ├── roles/            # User roles (admin.toml, user.toml)
│   │   ├── guards/           # Access rules (authenticated.toml)
│   │   ├── routes/           # Pages/screens (dashboard.toml)
│   │   ├── use-cases/        # Features with flow diagrams
│   │   ├── components/       # UI component specs
│   │   ├── events/           # Application events
│   │   ├── platforms/        # Multi-app support
│   │   └── knowledge/        # Q&A facts
│   ├── docs/                 # Markdown documentation
│   └── status.toml           # Project progress tracker
│
├── src/prototype/            # WORKING PROTOTYPE
│   ├── factories/            # Fake data generators
│   ├── mocks/                # Static JSON mock data
│   ├── pages/                # React page components
│   └── components/           # React UI components
│
├── rules/                    # LLM INSTRUCTIONS
│   ├── challenge.md          # Adaptive workflow (READ THIS)
│   ├── layers.md             # Layer structure reference
│   ├── patterns.md           # Code patterns
│   ├── prototype.md          # Prototype development guide
│   └── docs-pdf.md           # PDF generation, MCP, manifest
│
├── uploads/                  # Static files (images, PDFs)
│
└── core/                     # ENGINE (don't modify)
    ├── app/                  # React SPA
    ├── builder/              # Build system
    └── dev-server/           # Dev API
```

---

## Layer Types

| Layer | Purpose | Example |
|-------|---------|---------|
| `project/` | Project metadata | about.toml, tech.toml, business.toml |
| `entities/` | Data models | user.toml, product.toml |
| `roles/` | User types with permissions | admin.toml, user.toml |
| `guards/` | Access control rules | authenticated.toml, guest.toml |
| `routes/` | Pages and screens | dashboard.toml, profile.toml |
| `use-cases/` | Features with user stories | login.toml, checkout.toml |
| `components/` | UI component specs | user-card.toml, product-card.toml |
| `events/` | Application events | cart.add.toml, user.login.toml |
| `platforms/` | Multi-app definitions | customer-app.toml, admin-panel.toml |
| `knowledge/` | Q&A facts | auth.toml, payments.toml |

---

## Prototype ↔ Documentation Linking

Every prototype element links to its TOML specification using the `Doc` component.

### The Workflow

```
1. Define spec     →  src/spec/layers/pages/users.toml
2. Build generates →  public/generated/docs/layers/pages/users.json
3. Link in code    →  <Doc of="pages.users" floating />
4. User sees       →  "?" button linking to documentation
```

### Doc Component Usage

```tsx
import { Doc } from '@/components/ui'

export default function UsersPage() {
  const { data: users } = useRepo<User>('users')

  return (
    <>
      {/* Page-level documentation (floating "?" button) */}
      <Doc of="pages.users" floating position="bottom-right" />

      <Container>
        {users.map(user => (
          {/* Component-level documentation (wrapper) */}
          <Doc key={user.id} of="components.user-card" entityId={user.id}>
            <UserCard user={user} />
          </Doc>
        ))}
      </Container>
    </>
  )
}
```

### Data Attributes for LLM/MCP

The Doc component renders data attributes for automation:

```html
<!-- Floating mode -->
<div data-doc-url="/docs/layers/pages/users" class="fixed bottom-6 right-6">
  <button>?</button>
</div>

<!-- Wrapper mode -->
<div data-component="user-card"
     data-doc-url="/docs/layers/components/user-card"
     data-entity-id="123">
  ...
</div>
```

| Attribute | Purpose |
|-----------|---------|
| `data-doc-url` | Path to documentation JSON |
| `data-component` | Component identifier |
| `data-screen` | Page/screen identifier |
| `data-entity-id` | Specific entity instance |

---

## LLM/RAG Integration

All specifications compile into a unified `manifest.json` for LLM agents and RAG systems.

### Access

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5173/generated/manifest.json` |
| Production | `https://your-domain.com/generated/manifest.json` |

### Structure

```json
{
  "version": "1.0.0",
  "generated": "2025-12-11T...",
  "project": {
    "id": "llm-boilerplate",
    "name": "LLM Boilerplate",
    "description": "...",
    "_meta": { "path": "layers/project/about.toml" }
  },
  "layers": {
    "entities": [...],
    "components": [...],
    "routes": [...],
    "useCases": [...],
    "roles": [...],
    "guards": [...],
    "events": [...]
  },
  "relations": {
    "byId": { "user": { "path": "...", "folder": "entities" } },
    "graph": { "user": { "roles": ["user", "admin"] } }
  }
}
```

### Why Manifest?

| Requirement | Solution |
|-------------|----------|
| RAG chunking | Each item in `layers.*` = 1 document chunk |
| LLM context | Flat arrays, descriptive fields, no deep nesting |
| Source tracing | `_meta.path` links to original TOML file |
| Programmatic access | Direct object traversal |

### LangChain Example

```python
from langchain.schema import Document
import json

manifest = json.load(open('manifest.json'))

documents = []
for layer_name, items in manifest['layers'].items():
    for item in items:
        doc = Document(
            page_content=f"{item.get('name', item['id'])}: {item.get('description', '')}\n{json.dumps(item)}",
            metadata={
                "layer": layer_name,
                "id": item['id'],
                "source": item['_meta']['path']
            }
        )
        documents.append(doc)

vectorstore.add_documents(documents)
```

### Frontend Access

```typescript
import { loadManifest } from '@/lib/docs-loader'

const manifest = await loadManifest()
const user = manifest.layers.entities.find(e => e.id === 'user')
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev     # http://localhost:5173

# Build for production
npm run build

# Type check
npm run typecheck
```

---

## For LLM Assistants

1. Read `src/spec/status.toml` — current state and profile
2. Read `rules/challenge.md` — adaptive workflow **(IMPORTANT)**
3. Check `src/spec/layers/` — existing specifications
4. Follow the workflow phases based on profile

Key rules files:
- `rules/challenge.md` — Adaptive algorithm
- `rules/layers.md` — Layer structure reference
- `rules/patterns.md` — Code patterns (Doc component, events)
- `rules/prototype.md` — Prototype development (useRepo, factories)
- `rules/docs-pdf.md` — PDF generation, MCP integration, manifest

---

## Tech Stack

React 19 • TypeScript • Vite • Tailwind CSS • shadcn/ui • Zustand • React Router • React Hook Form • Zod • ReactFlow • Prisma

---

## License

Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)

Copyright (c) 2025 Artyom Gorlovetskiy (unbywyd)

This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.

Full license text: https://creativecommons.org/licenses/by-nc/4.0/legalcode

**Commercial Licensing:** For commercial use, please contact the author to discuss licensing options.

Author: Artyom Gorlovetskiy (unbywyd) | Website: https://unbywyd.com
