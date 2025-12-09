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
import type { Entity } from '@prototype/factories'

export function EntityPage() {
  const { data: items, populate, deleteAll } = useRepo<Entity>('entities')

  return (
    <div className="space-y-6">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">Entities</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => populate(10)}>+10</Button>
          <Button variant="destructive" onClick={deleteAll}>Clear</Button>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => <Card key={item.id}>{item.name}</Card>)}
      </div>
    </div>
  )
}
```

## Imports

```typescript
// Core (engine) - DO NOT MODIFY
import { useRepo } from '@/hooks/useRepo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { registerFactory, faker } from '@/lib/data-factory'

// Prototype (your code) - modify freely
import { UserEntity } from '@prototype/factories'
import { UserForm } from '@prototype/components/forms/UserForm'
import { useAuthStore } from '@prototype/stores/auth.store'
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
└── pages/                # Page components
```
