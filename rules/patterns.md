# Code Patterns

## Repository (Recommended)

Use `useRepo` for all data operations - it provides CRUD with localStorage persistence.

```typescript
// In your page/component
import { useRepo } from '@/hooks/useRepo'
import type { UserEntity } from '@prototype/factories'

function UsersPage() {
  const {
    data: users,
    loading,
    create,
    update,
    delete: remove,
    populate,
  } = useRepo<UserEntity>('users')

  return (
    <div>
      <button onClick={() => populate(10)}>Add 10 Fake Users</button>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => remove(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## Data Factory

Register factories in `src/prototype/factories/index.ts`:

```typescript
import { registerFactory, faker } from '@/lib/data-factory'
import type { BaseEntity } from '@/lib/repository'

export interface TaskEntity extends BaseEntity {
  title: string
  status: 'todo' | 'done'
  assignee: string
}

registerFactory<TaskEntity>('tasks', () => ({
  title: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(['todo', 'done']),
  assignee: faker.person.fullName(),
}))
```

## Zustand Store (Legacy)

For complex state not suited for Repository:

```typescript
// stores/[entity].store.ts
import { create } from 'zustand'

interface State {
  items: Entity[]
  selected: Entity | null
  setItems: (items: Entity[]) => void
  select: (item: Entity | null) => void
  add: (item: Entity) => void
  update: (id: string, data: Partial<Entity>) => void
  remove: (id: string) => void
}

export const useStore = create<State>((set) => ({
  items: [],
  selected: null,
  setItems: (items) => set({ items }),
  select: (item) => set({ selected: item }),
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  update: (id, data) => set((s) => ({
    items: s.items.map((i) => i.id === id ? { ...i, ...data } : i)
  })),
  remove: (id) => set((s) => ({
    items: s.items.filter((i) => i.id !== id)
  })),
}))
```

## Zod Schema

```typescript
// schemas/[entity].schema.ts
import { z } from 'zod'

export const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
})

export type FormData = z.infer<typeof schema>
```

## Form Component

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema, type FormData } from '@prototype/schemas/entity.schema'

export function EntityForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register('name')} className="border rounded px-3 py-2" />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  )
}
```

## Page Component

```tsx
import { useRepo } from '@/hooks/useRepo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { dispatchEvent } from '@/lib/events'
import type { Entity } from '@prototype/factories'

export function EntityPage() {
  const { data: items, populate, deleteAll, delete: remove } = useRepo<Entity>('entities')

  const handlePopulate = () => {
    populate(10)
    dispatchEvent('entity.populate', { count: 10 })
  }

  const handleDelete = (id: string) => {
    remove(id)
    dispatchEvent('entity.delete', { entityId: id })
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">Entities</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePopulate}>+10</Button>
          <Button variant="destructive" onClick={deleteAll}>Clear</Button>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} onClick={() => handleDelete(item.id)}>
            {item.name}
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## Event Dispatch

Dispatch events to show toast notifications with links to documentation.

```typescript
import { dispatchEvent } from '@/lib/events'

// Simple event
dispatchEvent('auth.login')

// Event with payload
dispatchEvent('cart.add', { productId: '123', quantity: 1 })

// User actions
dispatchEvent('user.create', { userId: 'abc', userName: 'John' })
dispatchEvent('user.delete', { userId: 'abc' })
```

Events are defined in `src/spec/layers/events/*.toml`. Toast shows:
- Event name and truncated description
- Category color indicator (auth=blue, commerce=green, form=purple)
- "Details" link to documentation
- Auto-dismiss after 5 seconds

## Imports

```typescript
// Core (engine) - DO NOT MODIFY
import { useRepo } from '@/hooks/useRepo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { registerFactory, faker } from '@/lib/data-factory'
import { dispatchEvent } from '@/lib/events'

// Prototype (your code) - modify freely
import { UserEntity } from '@prototype/factories'
import { UserForm } from '@prototype/components/forms/UserForm'
import { useAuthStore } from '@prototype/stores/auth.store'
```

## Multi-Platform Routing

For projects with multiple platforms (customer app, admin panel, etc.):

```
/prototype              → PlatformHub (platform selector)
/prototype/customer     → Customer app routes
/prototype/admin        → Admin panel routes
/prototype/vendor       → Vendor portal routes
```

### Platform Hub Component

```tsx
// pages/PlatformHub.tsx
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Monitor, Shield, Store } from 'lucide-react'

const platforms = [
  { id: 'customer', name: 'Customer App', icon: Monitor, path: '/prototype/customer' },
  { id: 'admin', name: 'Admin Panel', icon: Shield, path: '/prototype/admin' },
  { id: 'vendor', name: 'Vendor Portal', icon: Store, path: '/prototype/vendor' },
]

export function PlatformHub() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Select Platform</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {platforms.map(({ id, name, icon: Icon, path }) => (
          <Link key={id} to={path}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <Icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{name}</CardTitle>
                <CardDescription>Open {name.toLowerCase()}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### Route Config per Platform

```tsx
// config/routes.ts
export const platformRoutes = {
  customer: [
    { path: 'home', element: <CustomerHome /> },
    { path: 'catalog', element: <Catalog /> },
    { path: 'cart', element: <Cart /> },
  ],
  admin: [
    { path: 'dashboard', element: <AdminDashboard /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'settings', element: <Settings /> },
  ],
}
```

## File Structure

```
src/prototype/
├── factories/index.ts    # Entity types + factories
├── mocks/*.json          # Initial mock data
├── schemas/*.schema.ts   # Zod validation
├── stores/*.store.ts     # Zustand (if needed)
├── services/*.service.ts # Business logic
├── guards/*.tsx          # Route guards
├── config/               # Roles, routes config
├── components/
│   ├── ui/               # Reusable UI
│   └── forms/            # Form components
└── pages/
    ├── PlatformHub.tsx   # Platform selector (if multi-platform)
    ├── customer/         # Customer app pages
    ├── admin/            # Admin panel pages
    └── vendor/           # Vendor portal pages
```
