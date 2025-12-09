# Specification Guide

How to define your project using TOML specification layers.

## Overview

Specifications live in `src/spec/` and describe your project:

```
src/spec/
├── status.toml           # Current phase and progress
├── layers/               # TOML specifications
│   ├── project/          # About the project
│   ├── entities/         # Data models
│   ├── roles/            # User types
│   ├── guards/           # Access rules
│   ├── routes/           # Pages/screens
│   ├── use-cases/        # Features with flows
│   ├── knowledge/        # Q&A facts
│   ├── components/       # UI components
│   └── modules/          # Domain modules (complex)
└── docs/                 # Markdown documentation
```

## Layer Types

### project/
Project metadata and configuration.

```toml
# src/spec/layers/project/about.toml
[project]
id = "my-app"
name = "My App"
description = "A brief description of the project"
type = "web-app"  # web-app | mobile-app | api | library

[owner]
name = "John Doe"
email = "john@example.com"
```

```toml
# src/spec/layers/project/tech.toml
[stack]
frontend = "React + TypeScript"
styling = "Tailwind CSS"
state = "Zustand"
validation = "Zod"
```

### entities/
Data models - one file per entity.

```toml
# src/spec/layers/entities/user.toml
[entity]
id = "user"
name = "User"
table = "users"
description = "Application user"

[[fields]]
name = "id"
type = "string"
primary = true
auto = "cuid"

[[fields]]
name = "email"
type = "string"
format = "email"
required = true
unique = true

[[fields]]
name = "name"
type = "string"
required = true

[[fields]]
name = "role"
type = "enum"
values = ["admin", "user"]
default = "user"

[[fields]]
name = "createdAt"
type = "datetime"
auto = "now"
```

**Field types:** `string`, `text`, `number`, `integer`, `boolean`, `datetime`, `enum`, `array`, `relation`

**Field options:**
- `required` - must have value
- `unique` - no duplicates
- `primary` - primary key
- `hidden` - not shown in UI
- `auto` - auto-generated (`cuid`, `uuid`, `now`, `increment`)
- `default` - default value
- `format` - validation format (`email`, `url`, `phone`)
- `values` - enum values array
- `target` - relation target entity

### roles/
User types with permissions.

```toml
# src/spec/layers/roles/admin.toml
[role]
id = "admin"
name = "Administrator"
description = "Full system access"
level = 2  # Higher = more permissions

[permissions]
list = ["manage:users", "manage:products", "view:analytics"]

[relations]
guards = ["authenticated", "admin"]
```

### guards/
Access control rules.

```toml
# src/spec/layers/guards/authenticated.toml
[guard]
id = "authenticated"
name = "Authentication Required"
description = "User must be logged in"

[access]
authenticated = true
roles = []  # Any authenticated role
```

```toml
# src/spec/layers/guards/admin.toml
[guard]
id = "admin"
name = "Admin Only"
description = "Requires admin role"

[access]
authenticated = true
roles = ["admin"]
```

### routes/
Application pages and screens.

```toml
# src/spec/layers/routes/dashboard.toml
[route]
id = "route_dashboard"
path = "/dashboard"
title = "Dashboard"
description = "Main dashboard with stats"

[page]
type = "authenticated"  # public | authenticated | admin
layout = "main"
role = "user"

[features]
list = ["View stats", "Quick actions", "Recent activity"]

[components]
used = ["stats-card", "activity-list"]

[relations]
guards = ["authenticated"]
roles = ["user", "admin"]
entities = ["user"]
```

### use-cases/
Features with user story format and flow diagrams.

```toml
# src/spec/layers/use-cases/user-login.toml
[useCase]
id = "uc_login"
name = "User Login"
description = "Authenticate user with email and password"
asRole = "visitor"
iWant = "to log into my account"
soThat = "I can access protected features"

[useCase.conditions]
pre = ["User has registered account", "User is not logged in"]
post = ["User is authenticated", "Session is created"]

[relations]
roles = ["visitor"]
guards = ["guest"]
routes = ["route_login"]
entities = ["user"]

# Flow diagram nodes
[[flow]]
id = "start"
type = "start"
label = "User opens login page"

[[flow]]
id = "enter_credentials"
type = "action"
label = "Enter email and password"

[[flow]]
id = "validate"
type = "decision"
label = "Credentials valid?"

[[flow]]
id = "success"
type = "action"
label = "Create session, redirect to dashboard"

[[flow]]
id = "error"
type = "action"
label = "Show error message"

[[flow]]
id = "end"
type = "end"
label = "Login complete"
```

**Flow node types:** `start`, `end`, `action`, `decision`

### knowledge/
Project knowledge base - facts, decisions, assumptions.

```toml
# src/spec/layers/knowledge/auth.toml
[topic]
id = "auth"
name = "Authentication"
description = "How auth works in the system"

[[facts]]
question = "What auth method is used?"
answer = "JWT tokens with refresh token rotation"
status = "verified"
tags = ["auth", "security"]

[[facts]]
question = "Where are tokens stored?"
answer = "Access token in memory, refresh in httpOnly cookie"
status = "verified"
tags = ["auth", "storage"]

[[facts]]
question = "Session timeout?"
answer = "15 min access token, 7 day refresh token"
status = "assumption"
tags = ["auth", "config"]
```

**Fact status:** `verified`, `assumption`, `pending`

### components/
UI components with props, variants, and live preview.

```toml
# src/spec/layers/components/button.toml
[component]
id = "button"
name = "Button"
description = "Interactive button element"
category = "ui"  # ui | forms | pages

[[props]]
name = "variant"
type = "enum"
values = ["default", "primary", "secondary", "outline", "ghost", "destructive"]
default = "default"
description = "Visual style variant"

[[props]]
name = "size"
type = "enum"
values = ["sm", "md", "lg"]
default = "md"
description = "Button size"

[[props]]
name = "children"
type = "ReactNode"
required = true
description = "Button content"

[[props]]
name = "disabled"
type = "boolean"
default = false
description = "Disable interactions"

# Preview variants (rendered in docs)
[[variants]]
name = "Primary"
props = { variant = "primary", children = "Click me" }

[[variants]]
name = "Outline"
props = { variant = "outline", children = "Cancel" }

[[variants]]
name = "Destructive"
props = { variant = "destructive", children = "Delete" }

[usage]
code = """
import { Button } from '@/components/ui/button'

<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>
"""

[relations]
routes = ["route_dashboard"]
```

**Component categories:**
- `ui` - Base elements (Button, Input, Card, Badge, Modal)
- `forms` - Form components (LoginForm, UserForm)
- `pages` - Full page components (DashboardPage)

### modules/ (Complex Projects Only)
Domain decomposition for large applications.

```toml
# src/spec/layers/modules/auth.toml
[module]
id = "auth"
name = "Authentication"
description = "User authentication and session management"

[module.scope]
entities = ["user", "session", "token"]
useCases = ["login", "logout", "register", "forgot-password"]
routes = ["/login", "/register", "/forgot-password"]

[module.interfaces]
exports = ["AuthProvider", "useAuth", "ProtectedRoute"]
depends = []  # Other module IDs this depends on
```

## Relations

Any layer file can reference other layers using `[relations]`:

```toml
[relations]
roles = ["user", "admin"]           # Reference roles
guards = ["authenticated"]          # Reference guards
entities = ["user", "product"]      # Reference entities
routes = ["route_dashboard"]        # Reference routes
useCases = ["uc_login"]             # Reference use cases
components = ["button", "card"]     # Reference components
modules = ["auth"]                  # Reference modules
```

Relations create a navigable graph in the documentation viewer.

## Adding a New Layer

### 1. Create TOML File

```bash
# Create new entity
touch src/spec/layers/entities/order.toml
```

### 2. Define Content

```toml
# src/spec/layers/entities/order.toml
[entity]
id = "order"
name = "Order"
table = "orders"
description = "Customer purchase order"

[[fields]]
name = "id"
type = "string"
primary = true
auto = "cuid"

[[fields]]
name = "userId"
type = "relation"
target = "user"
required = true

[[fields]]
name = "status"
type = "enum"
values = ["pending", "paid", "shipped", "delivered", "cancelled"]
default = "pending"

[[fields]]
name = "total"
type = "number"
required = true

[[fields]]
name = "createdAt"
type = "datetime"
auto = "now"

[relations]
entities = ["user"]
```

### 3. Rebuild

```bash
npm run build
```

The layer will appear in the documentation viewer with proper rendering.

## Best Practices

1. **One concept per file** - Each entity, role, guard gets its own file
2. **Use meaningful IDs** - IDs should be lowercase, snake_case or kebab-case
3. **Add descriptions** - Help future readers understand intent
4. **Link via relations** - Build the knowledge graph
5. **Keep it DRY** - Define once, reference everywhere
6. **Start simple** - Add complexity only when needed

## Validation

The system validates your TOML files during build. Common errors:
- Missing required fields (`id`, `name`)
- Invalid field types
- Broken relations (referencing non-existent entities)
- TOML syntax errors

Check build output for warnings and errors.
