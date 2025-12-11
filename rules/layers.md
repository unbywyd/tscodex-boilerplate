# Layer Reference

## project/
About the project. Files: about.toml, tech.toml, business.toml, design.toml

```toml
[project]
id = "my-app"
name = "My App"
description = "..."
type = "web-app"
```

## entities/
Data models with fields. One file per entity.

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
unique = true
```

Field types: string, text, number, integer, boolean, datetime, enum, array, relation

## roles/
User types with permissions.

```toml
[role]
id = "admin"
name = "Administrator"
level = 2

[permissions]
list = ["manage:users", "manage:products"]
```

## guards/
Access control rules.

```toml
[guard]
id = "authenticated"
name = "Auth Required"

[access]
authenticated = true
roles = []
```

## routes/
Pages/screens of the application.

```toml
[route]
id = "route_dashboard"
path = "/dashboard"
title = "Dashboard"

[page]
type = "authenticated"
role = "user"

[relations]
guards = ["authenticated"]
roles = ["user"]

[implementation]
component = "DashboardPage"           # Component name
file = "pages/DashboardPage.tsx"      # File path in prototype
status = "planned"                    # planned | in-progress | implemented
```

## use-cases/
Features with user story and flow diagram.

```toml
[useCase]
id = "uc_login"
name = "User Login"
asRole = "visitor"
iWant = "to log in"
soThat = "I can access my account"

[useCase.conditions]
pre = ["User has account"]
post = ["User is authenticated"]

[relations]
roles = ["visitor"]
guards = ["guest"]

[[flow]]
id = "start"
type = "start"
label = "User opens login page"

[[flow]]
id = "submit"
type = "action"
label = "Submit credentials"
```

## knowledge/
Q&A facts about the project.

```toml
[topic]
id = "auth"
name = "Authentication"

[[facts]]
question = "How does login work?"
answer = "JWT tokens stored in localStorage"
status = "verified"
tags = ["auth", "security"]
```

## components/
UI components with props, variants, and usage examples.

### Live Preview System

Components can render live previews in documentation if registered in `componentRegistry`:

```typescript
// src/prototype/components/ui/index.ts
export const componentRegistry: Record<string, ComponentType<any>> = {
  button: Button,    // id → Component
  card: Card,
  input: Input,
}
```

The `id` in TOML must match the key in registry. Then `[[variants]]` will render as live React components.

### Structure

```toml
[component]
id = "button"
name = "Button"
description = "Primary action button"
category = "ui"

[[props]]
name = "variant"
type = "enum"
values = ["default", "primary", "secondary", "outline", "ghost", "destructive"]
default = "default"
description = "Visual style"

[[props]]
name = "children"
type = "ReactNode"
required = true
description = "Button content"

[[variants]]
name = "Primary"
props = { variant = "primary", children = "Click me" }

[usage]
code = """
import { Button } from '@prototype/components/ui/Button'
<Button variant="primary">Click me</Button>
"""
```

Categories:
- `ui` - base elements (Button, Input, Card, Badge, Modal, Table, Menu...)
- `forms` - forms (LoginForm, RegisterForm, SearchForm, ProductForm...)
- `pages` - app screens (LoginPage, DashboardPage, ProductListPage...)

Prop types: string, boolean, enum, ReactNode, number

**Important**: Every screen/page should be a component with `category = "pages"`.
Page components compose other components. Link routes to page components via relations:

```toml
# components/dashboard-page.toml
[component]
id = "dashboard-page"
name = "Dashboard Page"
category = "pages"

[component.composition]
layout = "main-layout"
uses = ["stats-card", "activity-list", "quick-actions"]

# routes/dashboard.toml
[relations]
components = ["dashboard-page"]
```

## events/
Application events with visual feedback. Events show toast notifications with name, description, and link to docs.

```toml
[event]
id = "cart.add"
name = "Add to Cart"
description = "Product added to shopping cart"
category = "commerce"

[trigger]
action = "click"
element = "Add to Cart button"

[[payload]]
name = "productId"
type = "string"
description = "Product identifier"

[[payload]]
name = "quantity"
type = "number"
description = "Quantity added"

[relations]
components = ["cart-button", "product-card"]
```

Categories:
- `auth` - authentication events (login, logout, register)
- `commerce` - shopping events (add to cart, checkout, order)
- `form` - form events (submit, validate, reset)
- `navigation` - routing events (page view, redirect)

**Usage in code:**
```typescript
import { dispatchEvent } from '@/lib/events'

// Simple event
dispatchEvent('auth.login')

// Event with payload
dispatchEvent('cart.add', { productId: '123', quantity: 1 })
```

## platforms/
Project subsystems/applications. Use when project has multiple user-facing applications.

```toml
[platform]
id = "customer-app"
name = "Customer Application"
type = "web"  # web | mobile | api | desktop
description = "Main customer-facing application"

[platform.config]
baseRoute = "/customer"  # route namespace in prototype
theme = "light"  # optional theme override

[relations]
routes = ["home", "catalog", "cart", "checkout"]
roles = ["customer", "guest"]
guards = ["public", "authenticated"]
```

Platform types:
- `web` - Web application (SPA, SSR)
- `mobile` - Mobile app (React Native, Flutter)
- `api` - API service (REST, GraphQL)
- `desktop` - Desktop app (Electron, Tauri)

Example platforms:
- customer-app - Main user application
- admin-panel - Admin dashboard
- vendor-portal - Supplier/vendor interface
- mobile-app - Native mobile application

## modules/ (complex only)
Domain decomposition for large projects.

```toml
[module]
id = "auth"
name = "Authentication"
description = "User authentication and authorization"

[module.scope]
entities = ["user", "session", "token"]
useCases = ["login", "logout", "register"]
routes = ["/login", "/register", "/forgot-password"]

[module.interfaces]
exports = ["AuthProvider", "useAuth", "ProtectedRoute"]
depends = []  # other module ids
```

## Relations
Any file can reference others. Keys = folder names:

```toml
[relations]
roles = ["user", "admin"]
guards = ["authenticated"]
entities = ["user", "product"]
```

## Implementation (Universal)

Any layer can have an `[implementation]` section to link specification to actual code:

```toml
[implementation]
component = "UserCard"                    # Component/class name
file = "src/prototype/components/UserCard.tsx"  # File path
preview = "/prototype/users"              # Preview URL in prototype
status = "implemented"                    # planned | in-progress | implemented
```

| Field | Description |
|-------|-------------|
| `component` | Component or class name in code |
| `file` | Path to implementation file |
| `preview` | URL to see it in action (prototype page) |
| `status` | Implementation status |

**Status values:**
- `planned` — not started
- `in-progress` — work in progress
- `implemented` — complete and working

**Examples by layer:**

```toml
# components/user-card.toml
[implementation]
component = "UserCard"
file = "src/prototype/components/UserCard.tsx"
preview = "/prototype/users"
status = "implemented"

# pages/users.toml
[implementation]
component = "UsersPage"
file = "src/prototype/pages/UsersPage.tsx"
preview = "/prototype/users"
status = "implemented"

# use-cases/view-users.toml
[implementation]
route = "/prototype/users"
page = "users"
status = "implemented"

# events/user-create.toml
[implementation]
handler = "handleAddUser"
file = "src/prototype/pages/UsersPage.tsx"
line = 42
status = "implemented"

# entities/user.toml
[implementation]
interface = "UserEntity"
file = "src/prototype/pages/UsersPage.tsx"
mock = "src/prototype/mocks/users.json"
status = "implemented"
```

## Manifest (LLM/RAG)

All layers are compiled into a single `manifest.json` for LLM agents and RAG systems:

- **URL:** `/generated/manifest.json`
- **Dev:** `http://localhost:5173/generated/manifest.json`
- **Prod:** `https://domain.com/generated/manifest.json`

```typescript
import { loadManifest } from '@/lib/docs-loader'

const manifest = await loadManifest()
const entities = manifest.layers.entities
const user = entities.find(e => e.id === 'user')
```

Each layer item includes `_meta.path` pointing to the source TOML file.

See `rules/docs-pdf.md` for detailed manifest structure and LangChain integration.
