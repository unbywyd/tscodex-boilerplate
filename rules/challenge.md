# Challenge Manager

Guide users through project specification creation. This is your main workflow.

---

## TL;DR — Quick Reference

```
1. User describes idea → Ask Assessment questions
2. Select profile: simple | medium | complex
3. Go through phases, create TOML files after each
4. Always update status.toml after completing a phase
5. End with working React prototype
```

---

## Interview Workflow

Two files track the interview process:
- `src/spec/status.toml` — current phase and progress
- `src/spec/interview.toml` — answers collected from user

### Before Each Phase

1. Read `status.toml` → get `currentPhase`
2. Read `interview.toml` → find section matching current phase
3. Ask questions where value = `""` (empty)
4. Write user's answer to `interview.toml` immediately
5. When all required answers collected → update `status.toml`

### Question Depth by Profile

| Depth | Profile | Rule |
|-------|---------|------|
| Basic fields | all | Always ask |
| Medium fields | medium, complex | Skip for simple |
| Complex only fields | complex | Skip for simple/medium |

Check comments in `interview.toml` — fields marked "(complex only)" or "(medium+)".

### Conditional Questions

Some questions depend on previous answers:

| Condition | Then ask |
|-----------|----------|
| `platforms = "multiplatform"` | `platformList` |
| `projectType = "mobile"` | `appSides`, then if dual → `appSidesList` |
| `aiIntegration = true` | `aiProvider`, `aiFeatures` |
| `authModel = "authenticated" or "mixed"` | `authMethods`, `socialAuth`, `userTypes` |
| `authModel = "mixed"` | `publicParts` |
| `authMethods` contains "phone" | `phoneFormat` |
| `primaryLanguage` = ar, he, fa, ur | auto-set `rtlSupport = true` |
| `additionalLanguages` has ar/he/fa/ur | ask `rtlSupport` |
| `darkMode = true` | consider in colorScheme |

### Data Format Rules

- Use `false` not `""` for boolean fields
- Use `[]` not `""` for list fields
- Use `""` for text and enum fields
- Arrays: `["item1", "item2"]` not `"item1, item2"`

Skip conditional fields if condition not met.

### RTL Support in Prototype

If `rtlSupport = true`:
- Add `dir="rtl"` to root HTML element
- Use logical CSS properties (margin-inline-start instead of margin-left)
- Mirror layouts (flex-direction, text-align)
- Use i18n library with RTL support (e.g., react-i18next)

### Example Flow

```
Status: currentPhase = "assessment"
Interview: assessment.projectType = ""

LLM: "What type of project? (web-app, mobile, api, landing, admin-panel)"
User: "web-app"

→ Write to interview.toml: projectType = "web-app"
→ Ask next empty field
→ When assessment complete: update status.toml, move to discovery
```

**Profiles:**
- **Simple** (5 phases): Assessment → Discovery → Data → Features → Prototype
- **Medium** (8 phases): + Design, Access, Schema
- **Complex** (9 phases): + Modules decomposition

**Key files:**
- `src/spec/status.toml` — current state (READ THIS FIRST)
- `src/spec/layers/` — all TOML specifications
- `src/prototype/` — React code output

---

## Full Workflow

**How it works:**
1. User describes their project idea
2. You ask Assessment questions to determine profile
3. You proceed through phases, asking questions at appropriate depth
4. After each phase: create TOML files in `src/spec/layers/`, update `status.toml`
5. End with working React prototype

Adaptive workflow for projects of any complexity.

## Phase 0: Assessment

**Goal:** Determine project scope and select workflow profile.

Questions:
- What type of project? (web-app | mobile | api | landing | admin-panel)
- How many user roles? (single | 2-3 | many with hierarchy)
- Data complexity? (simple-crud | relational | complex-hierarchy)
- External integrations? (none | few-apis | many-services)
- Multiple platforms? (single | 2-3 apps | many subsystems)
- Team size? (solo | small | large)

Based on answers, select profile:

### Profile: Simple
**For:** Landing pages, portfolios, simple CRUD apps, single-role tools
**Skip:** Phase 2 (Design), Phase 3 (Access) if single role
**Depth:** Shallow - key questions only, minimal files

### Profile: Medium
**For:** SaaS, e-commerce, multi-role apps, dashboards
**Include:** All core phases
**Depth:** Medium - detailed specs, full entities

### Profile: Complex
**For:** ERP, marketplaces, multi-tenant, enterprise
**Include:** All phases + Modules decomposition
**Depth:** Deep - edge cases, constraints, alternatives

**Status Update:**
```toml
[status]
profile = "medium"  # selected profile
currentPhase = "discovery"  # next phase
multiPlatform = false  # true if 2+ platforms

[phases.assessment]
status = "completed"

[phases.assessment.checklist]
typeIdentified = true
rolesCount = true
dataComplexity = true
platformsIdentified = true
profileSelected = true
```

Also set skip flags based on profile:
- Simple: `phases.design.skip = true` (if no design needed), `phases.access.skip = true` (if single role)
- Medium: all skips = false
- Complex: `phases.modules.skip = false`

**Multi-platform projects:** If user has 2+ platforms (e.g., customer app + admin panel):
- Set `status.multiPlatform = true`
- Create platform files in Phase 5 (Features)
- Prototype will include platform selector/hub page

---

## Phase 1: Discovery

**Goal:** Understand the project fundamentals.

### Shallow (Simple)
- What is this project in one sentence?
- Who will use it?
- What's the main action users take?

### Medium
- What problem does it solve?
- Who is the target audience?
- What's the core value proposition?
- What are the key features (top 5)?
- Any technical constraints?

### Deep (Complex)
- All medium questions +
- What are the business goals?
- What existing systems to integrate?
- What are the compliance requirements?
- What's the expected scale?
- Who are the stakeholders?

Output:
- `layers/project/about.toml`
- `layers/knowledge/*.toml` (capture all facts)

**Status Update:**
```toml
[status]
currentPhase = "design"  # or "data" for simple profile

[phases.discovery]
status = "completed"

[phases.discovery.checklist]
projectDefined = true
targetAudience = true
coreValue = true
keyFeatures = true
```

---

## Phase 2: Design (Optional for Simple)

**Goal:** Define visual and UX requirements.

Questions:
- Custom design or standard UI kit?
- Color scheme preferences?
- Mobile-first or desktop-first?
- Any brand guidelines?

Output:
- `layers/project/design.toml`

**Status Update:**
```toml
[status]
currentPhase = "access"  # or "data" if access skipped

[phases.design]
status = "completed"

[phases.design.checklist]
designApproach = true
colorScheme = true
responsiveStrategy = true
```

---

## Phase 3: Access Control (Skip if single role)

**Goal:** Define who can do what.

### Medium
- List all user types
- What can each role do?
- What pages are protected?

### Deep
- Role hierarchy and inheritance
- Permission granularity (page | feature | field)
- Multi-tenant considerations
- Guest vs authenticated flows

Output:
- `layers/roles/*.toml`
- `layers/guards/*.toml`

**Status Update:**
```toml
[status]
currentPhase = "data"

[phases.access]
status = "completed"

[phases.access.checklist]
rolesIdentified = true
permissionsDefined = true
guardsCreated = true
```

---

## Phase 4: Data Model

**Goal:** Define entities and their relationships.

### Shallow
- What are the main objects? (usually 2-5)
- What fields does each have?

### Medium
- All entities with full field definitions
- Relationships between entities
- Required vs optional fields
- Validation rules

### Deep
- All medium +
- Field-level permissions
- Audit trails
- Soft delete requirements
- Data lifecycle (created → active → archived)
- Indexes and performance considerations

Output:
- `layers/entities/*.toml`

**Status Update:**
```toml
[status]
currentPhase = "features"  # or "modules" for complex profile

[phases.data]
status = "completed"

[phases.data.checklist]
entitiesListed = true
fieldsDefined = true
relationsMapped = true
```

---

## Phase 5: Features & Screens

**Goal:** Define what users can do and what they see.

### Shallow
- List main screens (3-5)
- What's the primary user flow?

### Medium
- Use cases with user stories
- All routes/screens
- Page components with composition
- Happy path + basic error handling

### Deep
- All medium +
- Alternative flows
- Edge cases
- Error recovery
- Loading/empty states
- Offline behavior

Output:
- `layers/use-cases/*.toml`
- `layers/routes/*.toml`
- `layers/components/*.toml`
- `layers/platforms/*.toml` (if multiple platforms)

**Rule:** Every route must have a page component. Every page component must declare its composition (what UI components it uses).

**Platforms:** If project has multiple platforms (e.g., customer app + admin panel), create platform files that group related routes, roles, and guards.

**Status Update:**
```toml
[status]
currentPhase = "prototype"

[phases.features]
status = "completed"

[phases.features.checklist]
useCasesDefined = true
routesCreated = true
pageComponents = true
compositions = true
```

---

## Phase 6: Modules (Complex only)

**Goal:** Decompose large projects into manageable domains.

When to use:
- More than 10 entities
- More than 5 distinct user flows
- Multiple teams working on project
- Clear domain boundaries exist

Process:
1. Identify domains (e.g., auth, catalog, orders, payments)
2. Create module definition for each
3. Each module goes through phases 4-5 independently
4. Define module interfaces (how they communicate)

Output:
- `layers/modules/*.toml` (module definitions)
- Entities/routes/components organized by module

**Status Update:**
```toml
[status]
currentPhase = "features"  # return to features for each module

[phases.modules]
status = "completed"

[phases.modules.checklist]
domainsIdentified = true
modulesDefined = true
interfacesSet = true
```

---

## Phase 7: Prototype

**Goal:** Working React screens with mock data.

**IMPORTANT: Demo Content Cleanup**

Before generating, clean up demo/example files from `src/prototype/`:
- Delete: `mocks/users.json`, `mocks/products.json`
- Delete: `stores/users.store.ts`
- Delete: `schemas/user.schema.ts`
- Delete: `components/forms/UserForm.tsx`
- Delete: example pages (but keep `NotFound.tsx`)
- Keep: `guards/`, `hooks/`, `config/`, `components/ui/`, `factories/`

These are template examples - generate fresh code based on actual specs.

Actions:
- Clean up demo content (see above)
- Generate mock JSON from entities
- Create page components in `src/prototype/`
- Implement navigation
- Wire up forms (no backend)
- **For mobile projects**: Use `MobileFrame` wrapper (see `rules/mobile.md`)

Output:
- `src/prototype/mocks/*.json`
- `src/prototype/pages/*.tsx`
- `src/prototype/components/**/*.tsx`

**Status Update:**
```toml
[status]
currentPhase = "schema"  # or "done" for simple profile

[phases.prototype]
status = "completed"

[phases.prototype.checklist]
demoCleanedUp = true
mocksGenerated = true
pagesCreated = true
navigationWorks = true
formsWired = true
```

---

## Phase 8: Schema

**Goal:** Database schema ready for implementation.

Actions:
- Generate Prisma schema from entities
- Add relations
- Add indexes
- Validate

Output:
- `prisma/schema.prisma`

**Status Update:**
```toml
[status]
currentPhase = "done"

[phases.schema]
status = "completed"

[phases.schema.checklist]
prismaGenerated = true
relationsValid = true
indexesAdded = true
```

---

## Workflow Rules

1. **Start with Assessment** - always determine profile first
2. **Skip what's not needed** - Simple projects skip optional phases
3. **Ask before generating** - don't assume, clarify
4. **Update status.toml** - after EVERY phase completion:
   - Set `currentPhase` to next phase
   - Set completed phase `status = "completed"`
   - Mark all checklist items as `true`
   - Update `lastUpdated` date
5. **Capture knowledge** - every decision becomes a fact in knowledge/
6. **Validate relations** - ensure all references are valid
7. **Be verbose for Complex** - more explicit = better generation
8. **Iterate if needed** - can revisit phases when new info emerges

## Status Values

```
currentPhase: assessment | discovery | design | access | data | modules | features | prototype | schema | done
phase.status: pending | in_progress | completed
```

## Phase Transitions

Before moving to next phase, verify:

| From | Check | Status Update |
|------|-------|---------------|
| Assessment | Profile selected | `currentPhase = "discovery"`, checklist complete |
| Discovery | project/about.toml exists | `currentPhase = "design"` (or "data" for simple) |
| Design | design.toml exists | `currentPhase = "access"` (or "data" if access skipped) |
| Access | All roles and guards defined | `currentPhase = "data"` |
| Data Model | All entities valid | `currentPhase = "features"` (or "modules" for complex) |
| Modules | Boundaries and interfaces set | `currentPhase = "features"` |
| Features | Routes + page components ready | `currentPhase = "prototype"` |
| Prototype | All routes render | `currentPhase = "schema"` (or "done" for simple) |
| Schema | Prisma validates | `currentPhase = "done"` |

## Quick Reference

```
Simple:   Assessment → Discovery → Data → Features → Prototype
Medium:   Assessment → Discovery → Design → Access → Data → Features → Prototype → Schema
Complex:  Assessment → Discovery → Design → Access → Data → Modules → Features → Prototype → Schema
```
