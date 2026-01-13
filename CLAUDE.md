# tscodex-boilerplate-simple - Instructions

## Quick Start

1. **Read** `src/spec/platforms/web-app/status.toml` → check `currentPhase`
2. **Read** `src/spec/platforms/web-app/interview.toml` → check [meta] for language settings
3. **If no language set** → Ask: chatLanguage (LLM communication) + docsLanguage (documentation)
4. **Switch to chatLanguage** for all further communication
5. **Read** `rules/challenge.md` → full workflow details
6. **Ask** questions for current phase → write answers to interview.toml
7. **Create** TOML files in `src/spec/layers/` → write docs in docsLanguage

## Key Files

| File | Purpose |
|------|---------|
| `rules/challenge.md` | Full interview workflow, phases, questions |
| `rules/layers.md` | TOML structure for entities, roles, guards, use-cases, screens |
| `src/spec/platforms/{id}/status.toml` | Current phase, checklist, artifacts to create |
| `src/spec/platforms/{id}/interview.toml` | Collected answers |

## Architecture

```
core/                    # ❌ DO NOT MODIFY - engine code
src/spec/                # ✅ LLM CREATES HERE
├── platforms/           # Platform-specific interview progress
│   └── web-app/         # Default platform
│       ├── status.toml      # READ FIRST - current phase, artifacts
│       ├── interview.toml   # User answers
│       └── docs/            # Platform documentation (MD files)
└── layers/              # TOML specifications (shared)
    ├── project/         # about.toml
    ├── entities/        # Data models
    ├── roles/           # User roles
    ├── guards/          # Access control
    ├── use-cases/       # Features with flows
    ├── knowledge/       # Q&A facts
    ├── screens/         # Screen definitions
    └── modules/         # Domain modules (complex only)
```

## Workflow by Profile

```
Simple:   Assessment → Discovery → Data → Features → Documentation
Medium:   Assessment → Discovery → Design → Access → Data → Features → Schema → Documentation
Complex:  + Modules phase before Features
```

## Action-Oriented Workflow

For each phase:
1. Ask questions (from rules/challenge.md)
2. Write answers to interview.toml
3. **CREATE** artifact files listed in status.toml
4. Mark artifacts as `true` in status.toml
5. Update phase status to `completed`
6. Move to next phase

## Don't Modify

- `core/` — engine code
- `dist/` — build output
- `public/generated/` — auto-generated files
