# MVP Generator

File-driven specification system for LLM-assisted development. Define your project in TOML/Markdown, get documentation portal + working prototype.

## Concept

```
spec/ (TOML/MD files) → Documentation Portal + React Prototype
```

**For whom:**
- Developers planning projects with LLM assistance
- Teams needing structured specs before coding
- Anyone wanting to prototype ideas quickly

## Quick Start

```bash
npm install
npm run dev     # http://localhost:5173
```

## Structure

```
mvp-generator/
├── src/spec/           # YOUR PROJECT SPECIFICATION
│   ├── layers/         # Structured TOML files
│   │   ├── project/    # About, tech, business, design
│   │   ├── entities/   # Data models (User, Product...)
│   │   ├── roles/      # User roles (visitor, user, admin)
│   │   ├── guards/     # Access rules
│   │   ├── routes/     # Pages/screens
│   │   ├── use-cases/  # Features with flow diagrams
│   │   └── knowledge/  # Q&A facts
│   ├── docs/           # Markdown documentation
│   └── status.toml     # Project progress tracker
│
├── src/prototype/      # WORKING PROTOTYPE
│   ├── mocks/          # Mock JSON data
│   ├── pages/          # React pages
│   └── components/     # React components
│
├── rules/              # LLM INSTRUCTIONS
│   └── *.md            # Patterns and guidelines
│
└── core/               # ENGINE (don't modify)
    ├── app/            # React SPA
    ├── builder/        # Build system
    └── dev-server/     # Dev API
```

## Workflow

1. **Define spec** → Fill `src/spec/layers/` with TOML files
2. **View docs** → Navigate to `/docs` in browser
3. **Build prototype** → Create pages in `src/prototype/`
4. **Generate schema** → Export Prisma schema from entities

## Layer Types

| Layer | Purpose | Example |
|-------|---------|---------|
| `project/` | Project info | about.toml, tech.toml |
| `entities/` | Data models | user.toml, product.toml |
| `roles/` | User types | admin.toml, user.toml |
| `guards/` | Access rules | authenticated.toml |
| `routes/` | Pages | dashboard.toml |
| `use-cases/` | Features | login.toml (with flow) |
| `knowledge/` | Facts Q&A | auth.toml |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development mode |
| `npm run build` | Production build |
| `npm run typecheck` | Type validation |

## For LLM

Read `rules/` for patterns. Follow `status.toml` for current progress.

## Tech

React 19 • Vite • Tailwind • Zustand • React Hook Form • Zod • ReactFlow

## License

MIT
