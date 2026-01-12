# PDF Documentation Generation

Guide for creating printable project documentation from the specification.

---

## LLM with MCP: Component Documentation Workflow

This section describes how LLM agents with MCP capabilities can document prototype components.

### Doc Component System

All documentable elements in the prototype are wrapped with the `<Doc>` component which renders:

**Wrapper mode** — for components:
```tsx
<Doc of="components.user-card" entityId={user.id}>
  <Card>...</Card>
</Doc>
```
Renders:
```html
<div data-component="user-card" data-doc-url="/docs/layers/components/user-card" data-entity-id="123">
  ...
</div>
```

**Floating mode** — for pages:
```tsx
<Doc of="pages.users" floating position="bottom-right" />
```
Renders:
```html
<div data-doc-url="/docs/layers/pages/users" class="fixed bottom-6 right-6 z-50">
  <button>?</button>
</div>
```

### Data Attributes for LLM Navigation

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-screen` | Page/screen identifier | `data-screen="users"` |
| `data-component` | Component identifier | `data-component="user-card"` |
| `data-entity-id` | Specific entity instance | `data-entity-id="123"` |
| `data-doc-url` | **Path to documentation** | `data-doc-url="/docs/layers/components/user-card"` |

### Example: User wants to document a product card

**User request:**
> "Here's my prototype: http://localhost:5173/prototype/products — I want to document the product card component"

**LLM workflow:**

#### Step 1: Fetch page HTML via MCP
```
MCP: fetch_html("http://localhost:5173/prototype/products")
```

#### Step 2: Find documentable components
Search HTML for `data-doc-url` attributes:
```html
<!-- Page documentation (floating button) -->
<div data-doc-url="/docs/layers/pages/products" class="fixed bottom-6 right-6">

<!-- Component documentation (each card) -->
<div data-component="product-card" data-doc-url="/docs/layers/components/product-card" data-entity-id="1">
<div data-component="product-card" data-doc-url="/docs/layers/components/product-card" data-entity-id="2">
```

#### Step 3: Extract documentation path
From `data-doc-url="/docs/layers/components/product-card"` derive:
- **Layer:** `components`
- **ID:** `product-card`
- **TOML file:** `src/spec/layers/components/product-card.toml`

#### Step 4: Read specification
```
Read: src/spec/layers/components/product-card.toml
```
```toml
[component]
id = "product-card"
name = "Product Card"
description = "Displays product/pricing plan with features list"

[component.features]
list = [
  "Product name and description",
  "Price with currency formatting",
  "Features checklist",
  "Popular badge indicator"
]
```

#### Step 5: Take screenshot via MCP
```
MCP: screenshot(
  url: "http://localhost:5173/prototype/products",
  selector: "[data-component='product-card']",
  output: "public/uploads/docs/images/component-product-card.png"
)
```

For specific entity instance:
```
MCP: screenshot(
  selector: "[data-component='product-card'][data-entity-id='1']"
)
```

#### Step 6: Generate documentation markdown
```markdown
## Product Card

![Product Card]({{BASE_URL}}/uploads/docs/images/component-product-card.png)

Displays product/pricing plan with features list and selection button.

### Features
- Product name and description
- Price with currency formatting
- Features checklist
- Popular badge indicator

### Props
| Prop | Type | Description |
|------|------|-------------|
| product | Product | Product data object |
| onSelect | (id: number) => void | Selection callback |
```

#### Step 7: Save to documentation folder
```
Write: public/uploads/docs/6.Components.md
```

### Finding All Documentable Elements

**Via MCP HTML fetch:**
```javascript
// Find all documented elements
document.querySelectorAll('[data-doc-url]')

// Find all pages
document.querySelectorAll('[data-screen]')

// Find all components
document.querySelectorAll('[data-component]')
```

**Via codebase search:**
```bash
# Find Doc usages in prototype
grep -rn "Doc of=" src/prototype/

# Find all TOML specs
ls src/spec/layers/*/
```

### Path Resolution

| `data-doc-url` value | TOML file path |
|---------------------|----------------|
| `/docs/layers/pages/users` | `src/spec/layers/pages/users.toml` |
| `/docs/layers/components/user-card` | `src/spec/layers/components/user-card.toml` |
| `/docs/layers/entities/product` | `src/spec/layers/entities/product.toml` |

### MCP Tools Required

| Tool | Purpose |
|------|---------|
| `fetch_html` | Get page HTML to find `data-doc-url` attributes |
| `screenshot` | Capture component/page screenshots with CSS selector |
| `file_read` | Read TOML specification files |
| `file_write` | Save generated markdown documentation |
| `pdf_generate` | Compile markdown files into PDF |

### Complete Example Session

```
User: Document the users page at http://localhost:5173/prototype/users

LLM:
1. MCP fetch_html → find data-doc-url="/docs/layers/pages/users"
2. Read src/spec/layers/pages/users.toml
3. MCP screenshot [data-screen="users"] → public/uploads/docs/images/screen-users.png
4. Find nested components: data-component="user-card"
5. Read src/spec/layers/components/user-card.toml
6. MCP screenshot [data-component="user-card"] → public/uploads/docs/images/component-user-card.png
7. Generate 5.Screens.md with page overview
8. Generate 6.Components.md with component details
9. Insert image references with {{BASE_URL}}
10. Compile to PDF via MCP
```

---

## Purpose

PDF documentation is needed for:
- **Business meetings** — present project scope to stakeholders
- **Client handoff** — formal deliverable with technical specs
- **Investor pitch** — detailed technical appendix
- **Team onboarding** — offline-readable project overview
- **Contracts** — technical specification attachment

## Directory Structure

```
public/uploads/
└── docs/
    ├── 1.Intro.md
    ├── 2.Architecture.md
    ├── 3.Entities.md
    ├── 4.Features.md
    ├── 5.Screens.md
    ├── 6.API.md
    └── images/
        ├── logo.png
        ├── screen-dashboard.png
        └── diagram-flow.png
```

## File Naming Convention

Each file is a section in the final PDF. Prefix with order number:

```
1.Intro.md          → Section 1: Introduction
2.Architecture.md   → Section 2: Architecture
3.Entities.md       → Section 3: Data Models
...
```

MCP tool will collect files in alphabetical order (1, 2, 3...) to build table of contents.

## Image References

Use `{{BASE_URL}}` placeholder for images. MCP server substitutes the actual host.

```markdown
![Logo]({{BASE_URL}}/uploads/docs/images/logo.png)

![Dashboard Screen]({{BASE_URL}}/uploads/docs/images/screen-dashboard.png)
```

**Why placeholder?** MCP server needs full URL to fetch images. In dev it's `http://localhost:5173`, in prod it's your domain.

## Taking Screenshots

### Finding Screen Elements

Screens have `data-screen` attribute on the container:

```tsx
// UsersPage.tsx
<Container data-screen="users-page">
```

To find available screens, search codebase:

```bash
grep -r "data-screen=" src/prototype/
```

Current screens in prototype:
- `users-page` — User management page
- `products-page` — Product catalog page

### Screenshot via MCP

Request MCP server to capture screen:

```
Take screenshot of [data-screen="users-page"]
Save to public/uploads/docs/images/screen-users.png
```

MCP will:
1. Navigate to prototype URL
2. Find element with `data-screen="users-page"`
3. Capture screenshot
4. Save to specified path

### Component Screenshots

For individual components use `data-component`:

```
Take screenshot of [data-component="user-card"]
Save to public/uploads/docs/images/component-user-card.png
```

## Content Sources

Generate markdown from existing TOML specs:

| Section | Source |
|---------|--------|
| Intro | `src/spec/layers/project/about.toml` |
| Architecture | `src/spec/layers/project/tech.toml` |
| Entities | `src/spec/layers/entities/*.toml` |
| Roles & Access | `src/spec/layers/roles/*.toml`, `guards/*.toml` |
| Features | `src/spec/layers/use-cases/*.toml` |
| Screens | `src/spec/layers/routes/*.toml` |
| Components | `src/spec/layers/components/*.toml` |
| Events | `src/spec/layers/events/*.toml` |

### Adapting for Print

TOML specs are technical. For PDF, adapt to business-readable format:

**TOML (technical):**
```toml
[entity]
id = "user"
name = "User"
table = "users"

[[fields]]
name = "email"
type = "string"
format = "email"
required = true
```

**Markdown (print):**
```markdown
## User

The User entity represents registered users in the system.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | Email | Yes | User's email address |
| name | Text | Yes | Display name |
| role | Enum | Yes | User role (admin/user) |
```

## Generating PDF

### Step 1: Create markdown files

```
public/uploads/docs/
├── 1.Intro.md
├── 2.Architecture.md
├── 3.Entities.md
└── images/
```

### Step 2: Add screenshots

Request MCP to capture screens and save to `public/uploads/docs/images/`.

### Step 3: Generate PDF via MCP

```
Generate PDF from public/uploads/docs/
Base URL: <user provides URL>
Output: public/uploads/docs/Project-Documentation.pdf
```

MCP tool will:
1. Read all `*.md` files in order (1, 2, 3...)
2. Build table of contents from headings
3. Replace `{{BASE_URL}}` with user-provided base URL
4. Fetch images from URLs
5. Render to PDF with pagination

## Example Workflow

```
User: Generate PDF documentation for this project

Claude:
1. Create public/uploads/docs/ directory structure
2. Read TOML specs and generate markdown sections:
   - 1.Intro.md from project/about.toml
   - 2.Architecture.md from project/tech.toml
   - 3.Entities.md from entities/*.toml
   - 4.Features.md from use-cases/*.toml
   - 5.Screens.md from routes/*.toml
3. Capture screenshots via MCP:
   - Screenshot [data-screen="users-page"] → images/screen-users.png
   - Screenshot [data-screen="products-page"] → images/screen-products.png
4. Generate PDF via MCP tool:
   - Input: public/uploads/docs/*.md
   - Base URL: <provided by user>
   - Output: Project-Documentation.pdf
```

## Template: 1.Intro.md

```markdown
# {{PROJECT_NAME}}

![Logo]({{BASE_URL}}/uploads/docs/images/logo.png)

## Overview

{{PROJECT_DESCRIPTION}}

## Key Features

{{FEATURES_LIST}}

## Technology Stack

- **Frontend:** {{FRONTEND_TECH}}
- **Backend:** {{BACKEND_TECH}}
- **Database:** {{DATABASE}}

---
*Document generated: {{DATE}}*
```

## Data Attributes Reference

| Attribute | Selector | Purpose |
|-----------|----------|---------|
| `data-screen` | `[data-screen="users"]` | Page identifier (for pages layer) |
| `data-component` | `[data-component="user-card"]` | Component identifier |
| `data-entity-id` | `[data-entity-id="123"]` | Specific entity instance |
| `data-doc-url` | `[data-doc-url]` | **Direct path to documentation** |

### How Doc Component Assigns Attributes

The `<Doc>` component automatically assigns attributes based on the layer:

| Layer | Attribute | Example |
|-------|-----------|---------|
| `pages`, `routes`, `screens` | `data-screen` | `<Doc of="pages.users">` → `data-screen="users"` |
| `components`, `entities`, others | `data-component` | `<Doc of="components.user-card">` → `data-component="user-card"` |

All Doc elements also get `data-doc-url` with the full documentation path.

### Finding Documented Elements

**In browser (via MCP):**
```javascript
// All documented elements
document.querySelectorAll('[data-doc-url]')

// Pages only
document.querySelectorAll('[data-screen]')

// Components only
document.querySelectorAll('[data-component]')

// Specific component type
document.querySelectorAll('[data-component="user-card"]')
```

**In codebase:**
```bash
# Find all Doc usages
grep -rn "<Doc of=" core/app/src/

# Find TOML specs by layer
ls src/spec/layers/pages/
ls src/spec/layers/components/
```

### Current Prototype Documentation

| Element | Type | Doc Path | TOML File |
|---------|------|----------|-----------|
| Users Page | page | `/docs/layers/pages/users` | `src/spec/layers/pages/users.toml` |
| Products Page | page | `/docs/layers/pages/products` | `src/spec/layers/pages/products.toml` |
| User Card | component | `/docs/layers/components/user-card` | `src/spec/layers/components/user-card.toml` |
| Product Card | component | `/docs/layers/components/product-card` | `src/spec/layers/components/product-card.toml` |

### Screenshot Selectors

```bash
# Full page
[data-screen="users"]

# Any component of type
[data-component="user-card"]

# First instance only
[data-component="user-card"]:first-of-type

# Specific entity
[data-component="user-card"][data-entity-id="abc123"]

# Find by doc URL
[data-doc-url="/docs/layers/components/product-card"]
```

---

## Project Manifest for LLM/RAG

For LLM agents and RAG systems, the project provides a unified manifest containing all specifications.

### Accessing the Manifest

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5173/generated/manifest.json` |
| Production | `https://domain.com/generated/manifest.json` |

### Manifest Structure

```json
{
  "version": "1.0.0",
  "generated": "2025-12-11T...",
  "project": {
    "id": "tscodex-boilerplate-simple",
    "name": "tscodex-boilerplate-simple",
    "description": "...",
    "_meta": { "path": "layers/project/about.toml" }
  },
  "layers": {
    "entities": [...],
    "components": [...],
    "routes": [...],
    "pages": [...],
    "useCases": [...],
    "roles": [...],
    "guards": [...],
    "events": [...],
    "platforms": [...],
    "knowledge": [...],
    "modules": []
  },
  "docs": [
    {
      "id": "getting-started-intro",
      "title": "Introduction",
      "content": "...(markdown content)...",
      "_meta": { "path": "docs/getting-started/intro.md" }
    }
  ],
  "relations": {
    "byId": { "user": { "path": "...", "folder": "entities" } },
    "graph": { "user": { "roles": ["user", "admin"] } }
  }
}
```

### Layer Item Structure

Each item in `layers.*` arrays follows this pattern:

```json
{
  "id": "user-card",
  "name": "User Card",
  "description": "Displays user information in a card format",
  "category": "ui",
  "props": [...],
  "_meta": { "path": "layers/components/user-card.toml" }
}
```

- TOML wrapper keys (`[component]`, `[entity]`) are removed
- `_meta.path` traces back to source file
- Each item is a self-contained chunk for RAG

### Using with LangChain

```python
from langchain.schema import Document
import json

# Load manifest
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

# Add to vector store
vectorstore.add_documents(documents)
```

### Frontend Access

```typescript
import { loadManifest, type Manifest } from '@/lib/docs-loader'

const manifest: Manifest = await loadManifest()

// Find specific entity
const user = manifest.layers.entities.find(e => e.id === 'user')

// Get all components
const components = manifest.layers.components

// Access relations graph
const userRelations = manifest.relations.graph['user']
```

### Why Manifest for LLM?

| Requirement | Solution |
|-------------|----------|
| RAG chunking | Each item in `layers.*` array = 1 document chunk |
| LLM context | Flat arrays, descriptive fields, no deep nesting |
| Source tracing | `_meta.path` links to original TOML file |
| Programmatic access | Direct JavaScript object traversal |
| Deduplication | Relations in separate section, not embedded |