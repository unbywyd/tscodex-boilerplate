# Prototype Development Guide

Best practices for building prototypes with MVP Generator.

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
│   ├── ui/              # UI components (Button, Card, etc.)
│   └── forms/           # Form components
└── pages/               # Page components

core/                    # Engine code (DO NOT MODIFY)
├── app/src/lib/         # Core utilities (repository, data-factory)
├── app/src/hooks/       # Core hooks (useRepo)
└── app/src/components/  # Core UI components
```

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
