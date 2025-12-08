# Code Patterns

## Zustand Store
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
import { useForm } from '@prototype/hooks/useForm'
import { schema, type FormData } from '@prototype/schemas/entity.schema'

export function EntityForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm(schema)

  return (
    <form onSubmit={handleSubmit(onSuccess)} className="space-y-4">
      <FormField label="Name" {...register('name')} error={errors.name?.message} />
      <Button type="submit">Save</Button>
    </form>
  )
}
```

## Page Component
```tsx
export function EntityPage() {
  const items = useStore((s) => s.items)

  return (
    <div className="space-y-6">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">Entities</h1>
        <Button>Add</Button>
      </header>
      <div className="grid gap-4">
        {items.map((item) => <Card key={item.id} item={item} />)}
      </div>
    </div>
  )
}
```

## Imports
- `@/` → core/app/src
- `@prototype/` → src/prototype
