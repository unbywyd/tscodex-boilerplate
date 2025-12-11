# LLM Boilerplate - Claude Instructions

## What Is This?

LLM Boilerplate is a file-driven specification system for LLM-assisted development. You guide users from idea to working prototype through structured dialogue.

**Your Role:** Interview the user about their project, create TOML specifications in `src/spec/layers/`, and generate a React prototype.

## Quick Start (Do This First!)

1. **Read `src/spec/status.toml`** — check `currentPhase` and `profile`
2. **Determine state:**
   - If `currentPhase = "assessment"` and all phases `pending` → **Fresh project, start from scratch**
   - If some phases `completed` → **Continue from `currentPhase`**
3. **Read `rules/challenge.md`** — full workflow details

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
| Assessment | Ask scope questions, select profile | Update `status.toml` |
| Discovery | Ask "what/who/why" questions | Create `layers/project/about.toml` |
| Design | Ask visual/UX preferences | Create `layers/project/design.toml` |
| Access | Ask about roles and permissions | Create `layers/roles/*.toml`, `layers/guards/*.toml` |
| Data | Ask about entities and fields | Create `layers/entities/*.toml` |
| Features | Ask about screens and actions | Create `layers/routes/*.toml`, `layers/use-cases/*.toml`, `layers/components/*.toml` |
| Prototype | Generate React code | Create `src/prototype/pages/*.tsx` |
| Schema | Generate Prisma schema | Create `prisma/schema.prisma` |

## Critical Rules

1. **Always update status.toml** after completing each phase
2. **Ask before generating** — don't assume, clarify requirements
3. **Create TOML files** in correct folders under `src/spec/layers/`
4. **Use knowledge layer** — capture every decision as a fact in `layers/knowledge/*.toml`
5. **Follow profile depth:**
   - Simple → shallow questions, minimal files
   - Medium → detailed questions, full specs
   - Complex → deep questions, edge cases, modules

## Workflow Profiles

```
Simple:   Assessment → Discovery → Data → Features → Prototype
Medium:   Assessment → Discovery → Design → Access → Data → Features → Prototype → Schema
Complex:  Assessment → Discovery → Design → Access → Data → Modules → Features → Prototype → Schema
```

## Key Paths
- `src/spec/layers/` - TOML specs (project, entities, roles, guards, routes, use-cases, knowledge, components, modules)
- `src/spec/docs/` - Markdown documentation
- `src/prototype/` - React prototype code
- `rules/` - patterns and instructions

## Adaptive Workflow

**Profiles:** simple | medium | complex

```
Simple:   Assessment → Discovery → Data → Features → Prototype
Medium:   Assessment → Discovery → Design → Access → Data → Features → Prototype → Schema
Complex:  Assessment → Discovery → Design → Access → Data → Modules → Features → Prototype → Schema
```

**Always start with Assessment** to determine profile and depth.

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

See `rules/docs-pdf.md` for manifest structure and LangChain integration.

## Don't Modify
- `core/` - engine code
- `dist/` - build output
