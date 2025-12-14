# Prototype Development Guide

**⚠️ READ THIS ENTIRE FILE before writing any prototype code.**

## Pre-Flight Checklist

Before generating ANY code, verify:

```
□ Read this file completely (rules/prototype.md)
□ Read rules/mobile.md if building mobile app
□ Browsed /ui-kit page to see available components
□ Created TOML specs for entities in src/spec/layers/entities/
□ Created TOML specs for components in src/spec/layers/components/
□ Created TOML specs for events in src/spec/layers/events/
□ Generated Prisma schema (if medium/complex profile)
```

**Non-negotiable requirements:**
- UIKit components only (no native HTML)
- Doc wrappers on all business components
- **dispatchEvent on EVERY user action** (buttons, forms, toggles)

**Skipping these steps = rejected prototype.**

---

## CRITICAL: Schema-First Approach

**Prisma schema MUST be generated BEFORE prototype code.**

This is the LLM-first workflow:
1. **TOML specs** → define entities in `src/spec/layers/entities/`
2. **Prisma schema** → generate `prisma/schema.prisma` from entities
3. **Prototype** → build React UI based on schema types

### Why Schema First?
- Schema defines the data contract
- Types from Prisma inform component props
- Ensures UI matches data structure
- Prevents mismatch between UI and backend

### Before Starting Prototype
```
□ All entities defined in src/spec/layers/entities/*.toml
□ Prisma schema generated in prisma/schema.prisma
□ Run: npm run prisma:generate (if using Prisma client)
□ THEN start building prototype pages
```

---

## CRITICAL: Business Component Documentation

**EVERY business component MUST have:**

1. **TOML specification** in `src/spec/layers/components/[name].toml`
2. **Doc wrapper** in JSX using `<Doc of="components.[name]" entityId={id}>`

### Mandatory Checklist for Business Components

```
□ Created src/spec/layers/components/[name].toml
□ Added <Doc of="components.[name]"> wrapper in render
□ Page has <Doc of="pages.[name]" floating /> at top
□ Ran npm run build to generate docs JSON
```

### Example: Creating UserCard Component

**Step 1: Create TOML spec FIRST**
```toml
# src/spec/layers/components/user-card.toml
[component]
id = "user-card"
name = "User Card"
description = "Displays user information with avatar, name, role"

[component.props]
user = "UserEntity"
onDelete = "(id: string) => void"

[component.features]
list = ["Avatar display", "Role badge", "Delete action"]

[relations]
entities = ["user"]
pages = ["users"]

[implementation]
file = "src/prototype/components/UserCard.tsx"
status = "implemented"
```

**Step 2: Create React component**
```tsx
// src/prototype/components/UserCard.tsx
import { Doc, Card, Badge, Button } from '@/components/ui'

export function UserCard({ user, onDelete }) {
  return (
    <Doc of="components.user-card" entityId={user.id}>
      <Card>
        <img src={user.avatar} />
        <h3>{user.name}</h3>
        <Badge>{user.role}</Badge>
        <Button onClick={() => onDelete(user.id)}>Delete</Button>
      </Card>
    </Doc>
  )
}
```

**Step 3: Use in page with page-level Doc**
```tsx
// src/prototype/pages/Users.tsx
export default function UsersPage() {
  return (
    <>
      <Doc of="pages.users" floating position="bottom-right" />
      <Container>
        {users.map(user => (
          <UserCard key={user.id} user={user} onDelete={handleDelete} />
        ))}
      </Container>
    </>
  )
}
```

### Why This Is Important

| Without Doc | With Doc |
|-------------|----------|
| LLM can't trace component to spec | `data-doc-url` enables MCP integration |
| No documentation link | Click "?" → see TOML spec |
| No entity tracking | `data-entity-id` for testing/automation |
| Orphaned component | Full traceability |

**DO NOT skip Doc wrappers. They are NOT optional.**

---

## CRITICAL: Mobile Projects

**If building a mobile app, READ `rules/mobile.md` FIRST.**

It contains mandatory patterns:
- Standard app flow (splash → onboarding → auth → profile → permissions → home)
- Back navigation on EVERY screen (except home)
- OTP-based auth pattern
- Onboarding slides with skip button
- Permission request flow

---

## CRITICAL: Use UIKit Components — NO Native HTML

**NEVER use native HTML elements. ALWAYS use UIKit components.**

### Forbidden → Required

| ❌ NEVER USE | ✅ USE INSTEAD |
|--------------|----------------|
| `<button>` | `<Button>` |
| `<input>` | `<Input>` |
| `<select>` | `<Select>` |
| `<textarea>` | `<Textarea>` |
| `<a>` | `<Link>` or `<Button asChild>` |
| `<img>` | `<Avatar>`, `<img>` with classes |
| `<div class="card">` | `<Card>` |
| `<ul><li>` | `<MobileList>`, `<MobileListItem>` |
| `<dialog>` | `<Dialog>`, `<Modal>`, `<Sheet>` |
| `<form>` | `<form>` with UIKit inputs |
| Native checkbox | `<Checkbox>` |
| Native radio | `<RadioGroup>` |
| Native toggle | `<Switch>` |

### Import Pattern

```tsx
// ✅ CORRECT - import from UIKit
import {
  Button, Input, Card, Badge, Avatar,
  Dialog, Sheet, Select, Checkbox, Switch,
  MobileList, MobileListItem, TopBar, BottomNav,
} from '@/components/ui'

// ❌ WRONG - native HTML
<button onClick={...}>Submit</button>
<input type="text" />
<div className="card">...</div>
```

### Why This Matters

1. **Consistent styling** — UIKit follows design system
2. **Accessibility** — components have ARIA attributes built-in
3. **Mobile-ready** — touch targets, safe areas handled
4. **Dark mode** — automatic theme support
5. **Documentation** — all components documented at `/ui-kit`

### Quick Reference

Check `/ui-kit` page in browser for:
- All available components
- Live interactive demos
- Copy-paste code examples
- Props documentation

**If a component doesn't exist in UIKit, ask before creating custom HTML.**

---

## CRITICAL: Event Documentation — EVERY Action Needs dispatchEvent

**EVERY user action MUST trigger a dispatchEvent call.** This is NOT optional logging — it's core functionality that documents what happens on the backend.

### Why Events Are Mandatory

Events provide visual feedback showing "what would happen on the backend":
- User sees toast: "SMS sent to +7***1234"
- User understands the flow without real backend
- Stakeholders can review business logic
- QA can verify expected behavior

### Rule: No onClick Without dispatchEvent

```tsx
// ❌ WRONG - action without event
<Button onClick={() => login(phone)}>
  Sign In
</Button>

// ✅ CORRECT - action with event describing backend behavior
<Button onClick={() => {
  login(phone)
  dispatchEvent('auth.otp_sent', { phone, message: 'SMS sent with 6-digit code' })
}}>
  Sign In
</Button>
```

### Common Event Patterns

| User Action | Event | Message (что происходит на бэке) |
|-------------|-------|----------------------------------|
| Enter phone → Continue | `auth.otp_sent` | "SMS sent to +7***1234" |
| Enter OTP → Verify | `auth.login_success` | "User authenticated, session created" |
| Fill form → Submit | `order.created` | "Order #123 created, notification sent to seller" |
| Click "Add to cart" | `cart.item_added` | "Added to cart, stock reserved for 15 min" |
| Click "Pay" | `payment.initiated` | "Payment request sent to Stripe" |
| Click "Delete" | `user.deleted` | "User soft-deleted, data retained 30 days" |
| Toggle switch | `settings.updated` | "Push notifications enabled" |
| Upload file | `file.uploaded` | "File uploaded to S3, thumbnail generated" |

### Auth Flow Example (Complete)

```tsx
function AuthScreen({ onSuccess }) {
  const [stage, setStage] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const { login } = useAuth()

  const handleSendOTP = () => {
    setStage('otp')
    dispatchEvent('auth.otp_sent', {
      phone: phone.slice(0, -4) + '****',
      message: 'SMS sent with 6-digit verification code'
    })
  }

  const handleVerifyOTP = (code: string) => {
    login({ id: '1', phone })
    dispatchEvent('auth.login_success', {
      message: 'User authenticated, JWT token issued, session started'
    })
    onSuccess()
  }

  return (
    <Screen>
      {stage === 'phone' && (
        <>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <Button onClick={handleSendOTP}>Continue</Button>
        </>
      )}
      {stage === 'otp' && (
        <>
          <OTPInput onComplete={handleVerifyOTP} />
          <Button variant="ghost" onClick={() => {
            setStage('phone')
            dispatchEvent('auth.otp_resend_requested', { message: 'User requested new code' })
          }}>
            Resend code
          </Button>
        </>
      )}
    </Screen>
  )
}
```

### Order Flow Example

```tsx
function OrderForm() {
  const orders = useRepo<Order>('orders')

  const handleSubmit = (data: OrderData) => {
    const order = orders.create(data)

    dispatchEvent('order.created', {
      orderId: order.id,
      message: `Order #${order.id} created`
    })

    dispatchEvent('notification.sent', {
      to: 'seller',
      message: 'Push notification sent to seller'
    })

    dispatchEvent('inventory.reserved', {
      items: data.items.length,
      message: `${data.items.length} items reserved for 30 minutes`
    })
  }

  return <QuickForm fields={orderFields} onSubmit={handleSubmit} />
}
```

### Cart Example

```tsx
function ProductCard({ product }) {
  const cart = useCart()

  const handleAddToCart = () => {
    cart.add(product)
    dispatchEvent('cart.item_added', {
      productId: product.id,
      productName: product.name,
      message: `Added "${product.name}" to cart, stock reserved`
    })
  }

  return (
    <Card>
      <h3>{product.name}</h3>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </Card>
  )
}
```

### Event Naming Convention

```
[domain].[action]

auth.otp_sent
auth.login_success
auth.logout

order.created
order.confirmed
order.cancelled

cart.item_added
cart.item_removed
cart.cleared

payment.initiated
payment.success
payment.failed

user.created
user.updated
user.deleted

notification.sent
notification.read

file.uploaded
file.deleted
```

### Checklist Before Submitting Code

```
□ Every Button onClick has dispatchEvent
□ Every form onSubmit has dispatchEvent
□ Every toggle/switch onChange has dispatchEvent
□ Every delete action has dispatchEvent
□ Event message explains WHAT HAPPENS on backend
□ Events defined in src/spec/layers/events/*.toml
```

**Code without events = rejected. Events are the primary documentation of business logic.**

---

## Architecture Overview

```
src/prototype/           # Your prototype code (editable)
├── factories/           # Data factories for fake data generation
├── mocks/               # Static JSON mock data
├── stores/              # Zustand stores
├── schemas/             # Zod validation schemas
├── hooks/               # Custom React hooks
├── services/            # Business logic services
├── guards/              # Route protection components
├── config/              # Configuration (roles, routes)
├── components/
│   ├── ui/              # UIKit - low-level components (DO NOT document in project docs)
│   ├── mobile/          # Mobile-specific UIKit components
│   └── business/        # Business components (DOCUMENT in project docs)
└── pages/               # Page components

core/                    # Engine code (DO NOT MODIFY)
├── app/src/lib/         # Core utilities (repository, data-factory)
├── app/src/hooks/       # Core hooks (useRepo)
└── app/src/components/  # Core UI components
```

## UIKit vs Business Components

**CRITICAL DISTINCTION:**

| Type | Location | Document? | Examples |
|------|----------|-----------|----------|
| **UIKit** | `ui/`, `mobile/` | NO (use /ui-kit page) | Button, Card, Dialog, Toast, Counter |
| **Business** | `business/`, `pages/` | YES (TOML specs) | UserCard, OrderForm, ProductList |

### UIKit Components (Low-level)

Pre-built UI components ready to use. **DO NOT create TOML documentation for these.**

**Documentation & Reference:**
- Live demo with code: `/ui-kit` page in browser
- Component source: `src/prototype/components/ui/` and `src/prototype/components/mobile/`
- All exports: `src/prototype/components/ui/index.ts`

```tsx
// Just import and use - no documentation needed
import {
  Button, Card, Input, Badge,
  Dialog, Sheet, Drawer, Toast,
  Counter, StarRating, Slider,
  // ... see /ui-kit for full list
} from '@prototype/components/ui'

// Mobile components
import {
  MobileList, TopBar, BottomNav,
  ActionSheet, CardSlider,
} from '@prototype/components/ui'
```

### Business Components (Project-specific)

Components that implement business logic. **MUST be documented in TOML specs.**

```tsx
// src/prototype/components/business/UserCard.tsx
// REQUIRES: src/spec/layers/components/user-card.toml

export function UserCard({ user }: { user: UserEntity }) {
  return (
    <Card>
      <Avatar src={user.avatar} />
      <h3>{user.name}</h3>
      <Badge>{user.role}</Badge>
    </Card>
  )
}
```

### When to Create TOML Documentation

| Create TOML | Skip TOML |
|-------------|-----------|
| UserCard, ProductCard | Button, Card, Badge |
| OrderForm, LoginForm | Input, Select, Checkbox |
| DashboardPage, ProfilePage | Dialog, Sheet, Drawer |
| CartWidget, NotificationBell | Toast, Counter, Slider |

**Rule of thumb:** If it has business logic or entity binding → document it. If it's pure UI → use UIKit.

## Key Principle: Core vs Prototype

| Core (`core/`, `@/`)           | Prototype (`src/prototype/`, `@prototype/`) |
|--------------------------------|---------------------------------------------|
| Engine code, don't modify      | Your business logic                         |
| `useRepo`, `registerFactory`   | Entity definitions, factories               |
| Base UI components             | Custom components                           |
| Repository, persistence        | Stores, services, guards                    |

## Working with Data

### 1. Define Your Entity

```typescript
// src/prototype/factories/index.ts
import { registerFactory, faker } from '@/lib/data-factory'
import type { BaseEntity } from '@/lib/repository'

export interface ProjectEntity extends BaseEntity {
  name: string
  status: 'draft' | 'active' | 'completed'
  owner: string
  deadline: string
}

registerFactory<ProjectEntity>('projects', () => ({
  name: faker.commerce.productName(),
  status: faker.helpers.arrayElement(['draft', 'active', 'completed']),
  owner: faker.person.fullName(),
  deadline: faker.date.future().toISOString(),
}))
```

### 2. Create Mock Data (Optional)

```json
// src/prototype/mocks/projects.json
[
  {
    "id": "1",
    "name": "Website Redesign",
    "status": "active",
    "owner": "John Doe",
    "deadline": "2025-03-01"
  }
]
```

### 3. Use Repository in Components

```tsx
// src/prototype/pages/ProjectsPage.tsx
import { useRepo } from '@/hooks/useRepo'
import type { ProjectEntity } from '@prototype/factories'

export default function ProjectsPage() {
  const {
    data: projects,
    loading,
    create,
    update,
    delete: remove,
    populate,
    deleteAll,
  } = useRepo<ProjectEntity>('projects')

  // Add 10 fake projects
  const handlePopulate = () => populate(10)

  // Create single project
  const handleCreate = () => {
    create({
      name: 'New Project',
      status: 'draft',
      owner: 'Me',
      deadline: new Date().toISOString(),
    })
  }

  return (
    <div>
      <button onClick={handlePopulate}>Generate 10</button>
      <button onClick={handleCreate}>Add Project</button>
      <button onClick={deleteAll}>Clear All</button>

      {projects.map(p => (
        <div key={p.id}>
          {p.name} - {p.status}
          <button onClick={() => update(p.id, { status: 'completed' })}>
            Complete
          </button>
          <button onClick={() => remove(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## useRepo API Reference

```typescript
const {
  // State
  data,           // T[] - all entities
  loading,        // boolean - loading state
  error,          // Error | null
  count,          // number - total count

  // Read
  getAll,         // () => T[]
  getById,        // (id: string) => T | undefined
  getWhere,       // (predicate: (item: T) => boolean) => T[]
  getFirst,       // (predicate: (item: T) => boolean) => T | undefined

  // Write
  create,         // (data) => T
  update,         // (id, updates) => T | undefined
  patch,          // (id, updates) => T | undefined (alias)
  delete,         // (id: string) => boolean
  deleteWhere,    // (predicate) => number
  deleteAll,      // () => void

  // Bulk
  createMany,     // (items[]) => T[]
  updateMany,     // (ids[], updates) => T[]
  deleteMany,     // (ids[]) => number

  // Populate (uses registered factory)
  populate,       // (count?, replace?) => T[]
  populateWith,   // (count, factory, replace?) => T[]

  // Control
  init,           // (data[]) => void - init if empty
  reset,          // (data[]) => void - force reset
} = useRepo<MyEntity>('entity-name')
```

## Validation with Zod

```typescript
// src/prototype/schemas/project.schema.ts
import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  status: z.enum(['draft', 'active', 'completed']),
  owner: z.string().min(1),
  deadline: z.string().datetime(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
```

## Forms

### Quick Approach: QuickForm (Recommended for Prototypes)

For rapid prototyping, use `QuickForm` - declarative forms with built-in validation:

```tsx
import { QuickForm, validators } from '@prototype/components/ui'

// Define fields as config
const userFields = [
  { name: 'name', type: 'string', label: 'Full Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true, validation: [validators.email()] },
  { name: 'phone', type: 'phone', label: 'Phone' },
  { name: 'role', type: 'enum', label: 'Role', options: ['user', 'admin'], default: 'user' },
  { name: 'bio', type: 'text', label: 'About', rows: 3 },
  { name: 'isActive', type: 'boolean', label: 'Active' },
]

// Render form - done!
<QuickForm
  fields={userFields}
  onSubmit={(data) => users.create(data)}
  submitLabel="Create User"
/>
```

**Available field types:**
- `string`, `email`, `password`, `url` - text inputs
- `number`, `currency` - numeric inputs
- `phone` - phone input with formatting
- `text` - textarea
- `boolean` - checkbox
- `enum` - select dropdown
- `date` - date picker
- `otp` - OTP input

**Built-in validators:**
```tsx
validators.required('Custom message')
validators.email()
validators.minLength(3)
validators.maxLength(100)
validators.pattern(/regex/, 'Invalid format')
validators.min(0)
validators.max(100)
```

### SmartField for Single Fields

When you need individual fields with auto-type detection:

```tsx
import { SmartField } from '@prototype/components/ui'

<SmartField name="email" type="email" label="Email" required />
<SmartField name="price" type="currency" currency="USD" />
<SmartField name="role" type="enum" options={['admin', 'user']} />
<SmartField name="birthDate" type="date" locale="ru" />
```

### Traditional Approach: react-hook-form + Zod

For complex forms with custom logic:

```tsx
// src/prototype/components/forms/ProjectForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@prototype/schemas/project.schema'

export function ProjectForm({ onSubmit }: { onSubmit: (data: ProjectFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      <button type="submit">Save</button>
    </form>
  )
}
```

## Faker.js Quick Reference

```typescript
import { faker } from '@/lib/data-factory'

// Person
faker.person.fullName()          // "John Doe"
faker.person.firstName()         // "John"
faker.person.email()             // Deprecated, use internet.email()

// Internet
faker.internet.email()           // "john.doe@example.com"
faker.internet.userName()        // "john_doe"
faker.internet.avatar()          // Avatar URL

// Commerce
faker.commerce.productName()     // "Ergonomic Chair"
faker.commerce.price()           // "299.99"
faker.commerce.department()      // "Electronics"

// Lorem
faker.lorem.sentence()           // "Lorem ipsum dolor sit."
faker.lorem.paragraph()          // Full paragraph
faker.lorem.words(5)             // "lorem ipsum dolor sit amet"

// Date
faker.date.past()                // Date in past
faker.date.future()              // Date in future
faker.date.between({ from, to }) // Date in range

// Helpers
faker.helpers.arrayElement(['a', 'b', 'c'])   // Random element
faker.helpers.arrayElements(arr, { min, max }) // Random subset

// Numbers
faker.number.int({ min: 1, max: 100 })        // Random integer
faker.number.float({ min: 0, max: 1 })        // Random float

// Image
faker.image.avatar()             // Avatar URL
faker.image.urlPicsumPhotos()    // Random photo URL
```

## File Structure Best Practices

### Adding a New Entity

1. **Define factory** in `src/prototype/factories/index.ts`
2. **Create mock** in `src/prototype/mocks/[entity].json` (optional)
3. **Add schema** in `src/prototype/schemas/[entity].schema.ts`
4. **Create page** in `src/prototype/pages/[Entity]Page.tsx`
5. **Add form** in `src/prototype/components/forms/[Entity]Form.tsx`

### Import Aliases

```typescript
// Core (engine) - don't modify these
import { useRepo } from '@/hooks/useRepo'
import { Button } from '@/components/ui/button'

// Prototype (your code) - modify freely
import { ProjectEntity } from '@prototype/factories'
import { ProjectForm } from '@prototype/components/forms/ProjectForm'
```

## Data Persistence

All repository data is automatically persisted to `localStorage` with key `prototype-{name}`.

```typescript
// Data survives page refresh
const { data } = useRepo('projects') // Loads from localStorage

// Reset to mock data
const { reset } = useRepo('projects')
const response = await fetch('/generated/mocks/projects.json')
const mockData = await response.json()
reset(mockData)

// Clear all
const { deleteAll } = useRepo('projects')
deleteAll()

// Or clear localStorage directly
localStorage.removeItem('prototype-projects')
```

## Linking Prototype to Documentation

Every prototype element should be linked to its TOML specification using the `Doc` component.

### The Full Workflow

```
1. Define spec     →  src/spec/layers/pages/users.toml
2. Build generates →  core/app/public/generated/docs/layers/pages/users.json
3. Link in code    →  <Doc of="pages.users" floating />
4. User sees       →  "?" button linking to /docs/layers/pages/users
```

### Step 1: Create TOML Specification

```toml
# src/spec/layers/pages/users.toml
[page]
id = "users"
name = "Users Page"
description = "User management interface with CRUD operations"

[page.features]
list = [
  "Display users in responsive grid",
  "Add/delete users with fake data",
  "Role badges (admin/user)",
  "LocalStorage persistence"
]

[relations]
components = ["user-card"]
entities = ["user"]
```

```toml
# src/spec/layers/components/user-card.toml
[component]
id = "user-card"
name = "User Card"
description = "Displays user avatar, name, email and role"
category = "ui"

[[props]]
name = "user"
type = "UserEntity"
required = true
description = "User data object"

[relations]
entities = ["user"]
```

### Step 2: Link with Doc Component

```tsx
// In your page component
import { Doc } from '@/components/ui'

export default function UsersPage() {
  const { data: users } = useRepo<UserEntity>('users')

  return (
    <>
      {/* Page-level documentation (floating button) */}
      <Doc of="pages.users" floating position="bottom-right" />

      <Container>
        {users.map(user => (
          {/* Component-level documentation (hover button) */}
          <Doc key={user.id} of="components.user-card" entityId={user.id}>
            <UserCard user={user} />
          </Doc>
        ))}
      </Container>
    </>
  )
}
```

### Doc Component Reference

| Mode | Usage | When to use |
|------|-------|-------------|
| **Floating** | `<Doc of="pages.x" floating />` | Page-level, one per page |
| **Wrapper** | `<Doc of="components.x"><Child/></Doc>` | Components, list items |

**Props:**
- `of` — `"layer.id"` format (e.g., `"pages.users"`, `"components.user-card"`)
- `floating` — renders fixed button instead of wrapping children
- `position` — `"bottom-right"` | `"bottom-left"` | `"top-right"` | `"top-left"`
- `entityId` — specific entity instance ID (for wrapper mode)

### What Doc Renders

**Floating mode:**
```html
<div data-doc-url="/docs/layers/pages/users" class="fixed bottom-6 right-6">
  <button>?</button>
</div>
```

**Wrapper mode:**
```html
<div data-component="user-card" data-doc-url="/docs/layers/components/user-card" data-entity-id="123">
  ...children...
</div>
```

### Adding New Page Checklist

1. **Create page TOML:** `src/spec/layers/pages/[name].toml`
2. **Create component TOML:** `src/spec/layers/components/[name]-card.toml` (if needed)
3. **Run build:** `npm run build` (generates JSON in `public/generated/`)
4. **Create page component:** Add `<Doc of="pages.[name]" floating />` at top
5. **Wrap list items:** `<Doc of="components.[name]-card" entityId={item.id}>`
6. **Dispatch events:** `dispatchEvent('[name].create', { ... })`

### Why Link to Docs?

| Benefit | Description |
|---------|-------------|
| **MCP Integration** | LLM can find `data-doc-url` and navigate to specification |
| **Screenshot automation** | Use `[data-component="user-card"]` selector |
| **Traceability** | Click "?" → see TOML spec path → edit source |
| **Documentation** | Auto-generated docs from TOML specs |

See `rules/patterns.md` for complete Doc component documentation.

## Building Pages

### Page Structure

```tsx
export default function UsersPage() {
  // 1. Data hook
  const { data: users, loading, populate, delete: remove } = useRepo<UserEntity>('users')

  // 2. Event handlers
  const handleDelete = (id: string) => {
    remove(id)
    dispatchEvent('user.delete', { userId: id })
  }

  return (
    <>
      {/* 3. Page-level Doc (floating) */}
      <Doc of="pages.users" floating position="bottom-right" />

      {/* 4. Content container */}
      <Container size="lg" className="py-8">
        {/* 5. Header */}
        {/* 6. Loading / Empty / Content states */}
        {/* 7. Item cards with Doc wrapper */}
      </Container>
    </>
  )
}
```

### Two Data Approaches

| Use case | Approach |
|----------|----------|
| CRUD operations (users, cart) | `useRepo` with localStorage |
| Read-only catalog | `loadMock` from JSON |

```tsx
// CRUD with persistence
const { data, loading, create, update, delete: remove, populate } = useRepo<Entity>('entities')

// Read-only mock data
const [items, setItems] = useState([])
useEffect(() => { loadMock('items').then(setItems) }, [])
```

### Loading State

```tsx
{loading ? (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map(i => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
      </Card>
    ))}
  </div>
) : (
  // Content
)}
```

### Empty State

```tsx
{users.length === 0 ? (
  <Card className="p-8 text-center">
    <p className="text-muted-foreground mb-4">No users found</p>
    <Button onClick={() => populate(1)}>
      <Plus className="h-4 w-4 mr-2" />Add First User
    </Button>
  </Card>
) : (
  // Items grid
)}
```

### Header Pattern

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div className="flex items-center gap-3">
    <div className="rounded-lg bg-primary/10 p-2">
      <Users className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      <p className="text-muted-foreground text-sm">Manage user accounts</p>
    </div>
  </div>
  <div className="flex gap-2">
    <Button variant="outline" onClick={handleReset}>Reset</Button>
    <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add</Button>
  </div>
</div>
```

### Stats Cards

```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>Total Users</CardDescription>
      <CardTitle className="text-2xl">{users.length}</CardTitle>
    </CardHeader>
  </Card>
</div>
```

### Items Grid with Doc

```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {users.map(user => (
    <Doc key={user.id} of="components.user-card" entityId={user.id}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge>{user.role}</Badge>
        </CardContent>
      </Card>
    </Doc>
  ))}
</div>
```

### Responsive Patterns

| Pattern | Mobile | sm: | lg: |
|---------|--------|-----|-----|
| Grid | 1 col | 2 cols | 3 cols |
| Padding | py-4 | py-6 | py-8 |
| Button | Icon | Icon+text | Full |

```tsx
<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
<Button size="sm">
  <Plus className="h-4 w-4 sm:mr-2" />
  <span className="hidden sm:inline">Add User</span>
</Button>
```

## Common Patterns

### List + Detail View

```tsx
function EntityList() {
  const { data, delete: remove } = useRepo<Entity>('entities')
  const [selected, setSelected] = useState<Entity | null>(null)

  if (selected) {
    return <EntityDetail entity={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div>
      {data.map(item => (
        <Card key={item.id} onClick={() => setSelected(item)}>
          {item.name}
          <button onClick={(e) => { e.stopPropagation(); remove(item.id) }}>
            Delete
          </button>
        </Card>
      ))}
    </div>
  )
}
```

### Filtered List

```tsx
function FilteredList() {
  const { data, getWhere } = useRepo<Task>('tasks')
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? data
    : getWhere(t => t.status === filter)

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="done">Done</option>
      </select>
      {filtered.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  )
}
```

### Optimistic Updates

```tsx
function QuickEdit({ item }: { item: Entity }) {
  const { update } = useRepo<Entity>('entities')

  const toggle = () => {
    // Update is instant (optimistic)
    update(item.id, { active: !item.active })
  }

  return <button onClick={toggle}>{item.active ? 'Active' : 'Inactive'}</button>
}
```

## Component Live Preview

UI components can be previewed live in documentation at `/docs/layers/components/[id]`.

### How It Works

```
TOML spec → componentRenderer → componentRegistry → Live React render
```

1. **TOML** defines component metadata, props, and variants
2. **componentRegistry** maps component IDs to React components
3. **Variants** render as live interactive previews

### Adding Component with Live Preview

**Step 1: Create React Component**

```tsx
// src/prototype/components/ui/MyButton.tsx
export function MyButton({ variant = 'default', children }: Props) {
  return <button className={`btn btn-${variant}`}>{children}</button>
}
```

**Step 2: Register in componentRegistry**

```typescript
// src/prototype/components/ui/index.ts
import { MyButton } from './MyButton'

export const componentRegistry: Record<string, ComponentType<any>> = {
  // existing...
  'my-button': MyButton,  // key MUST match TOML id
}
```

**Step 3: Create TOML Spec**

```toml
# src/spec/layers/components/my-button.toml
[component]
id = "my-button"          # Must match registry key!
name = "My Button"
description = "Custom button"
category = "ui"

[[props]]
name = "variant"
type = "enum"
values = ["default", "primary"]
default = "default"

[[props]]
name = "children"
type = "ReactNode"
required = true

[[variants]]
name = "Default"
props = { variant = "default", children = "Click" }

[[variants]]
name = "Primary"
props = { variant = "primary", children = "Submit" }

[usage]
code = """
import { MyButton } from '@prototype/components/ui/MyButton'
<MyButton variant="primary">Click me</MyButton>
"""
```

### Result

Visit `/docs/layers/components/my-button`:
- **Props table** with types, defaults, required markers
- **Live variants** rendered as actual React components
- **Usage code** example

### If Component Not Registered

If `id` is not found in `componentRegistry`, variants show:
```
"Component not found in registry"
```

### Categories

| Category | Use for |
|----------|---------|
| `ui` | Base elements (Button, Input, Card, Badge) |
| `forms` | Form components (LoginForm, SearchForm) |
| `pages` | Full page components (DashboardPage) |
