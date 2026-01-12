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

## platforms/

Platform = an independent project with its own interview workflow. Each platform has configuration, interview tracking, and documentation.

### Directory Structure

```
src/spec/platforms/
├── web-app/
│   ├── platform.toml      # Platform configuration
│   ├── status.toml        # Interview progress (READ FIRST!)
│   ├── interview.toml     # Collected answers
│   └── docs/              # Generated documentation
│       ├── 01-overview.md
│       ├── 02-features.md
│       └── 03-user-flows.md
├── admin-panel/
│   ├── platform.toml
│   ├── status.toml
│   ├── interview.toml
│   └── docs/
│       ├── 01-overview.md
│       └── 02-user-management.md
└── mobile-app/
    ├── platform.toml
    ├── status.toml
    ├── interview.toml
    └── docs/
        └── 01-overview.md
```

### platform.toml

Platform configuration and metadata.

```toml
[platform]
id = "customer-app"
name = "Customer Application"
type = "web"  # web | mobile | api | desktop
description = "Main customer-facing application"

[platform.config]
baseRoute = "/customer"
theme = "light"

[relations]
roles = ["customer", "guest"]
guards = ["public", "authenticated"]
entities = ["user", "order", "product"]
```

### status.toml

Tracks interview progress. **LLM reads this first** to determine current phase.

```toml
[status]
profile = "medium"  # simple | medium | complex
currentPhase = "discovery"
lastUpdated = "2024-01-15"

[phases.assessment]
status = "completed"

[phases.discovery]
status = "in_progress"

# ... other phases
```

### interview.toml

Collected answers from user during interview phases.

```toml
[meta]
platformId = "web-app"
startedAt = "2024-01-10"

[assessment]
projectType = "web-app"
dataComplexity = "relational"
rolesCount = "2-3"

[discovery]
problem = "Users need to track their orders"
audience = "E-commerce customers"
# ... answers continue
```

### docs/ Directory

Markdown documentation files for the platform. Each file becomes a menu item in the UI.

**File naming convention:**
- Use numeric prefix for ordering: `01-`, `02-`, `03-`...
- Use kebab-case for names: `user-management.md`
- First `# Heading` in file = document title

**Example:** `docs/02-authentication.md`
```markdown
# Authentication

How users authenticate in the application.

## Login Flow
1. User enters email/password
2. System validates credentials
3. JWT token issued and stored

## Password Reset
...
```

**Build output:**
- `platforms/index.json` - list of all platforms
- `platforms/{id}/index.json` - platform details + docs table of contents
- `platforms/{id}/{doc-id}.json` - individual document content

### Platform Types

| Type | Description |
|------|-------------|
| `web` | Web application (SPA, SSR) |
| `mobile` | Mobile app (React Native, Flutter) |
| `api` | API service (REST, GraphQL) |
| `desktop` | Desktop app (Electron, Tauri) |

### Example Platforms

- `web-app` - Main customer-facing web application
- `admin-panel` - Admin dashboard for management
- `vendor-portal` - Supplier/vendor interface
- `mobile-app` - Native mobile application

### Workflow

See `rules/challenge.md` for complete interview workflow per platform.

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
status = "implemented"                    # planned | in-progress | implemented
```

| Field | Description |
|-------|-------------|
| `status` | Implementation status |

**Status values:**
- `planned` — not started
- `in-progress` — work in progress
- `implemented` — complete and working

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
