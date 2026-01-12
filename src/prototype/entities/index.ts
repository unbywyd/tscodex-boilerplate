import { entity, useStore } from 'protomobilekit'
import type { InferEntity } from 'protomobilekit'

// Example entity - User
export const User = entity({
  name: 'User',
  fields: {
    name: 'string',
    email: 'email',
    avatar: 'image',
    role: { type: 'enum', values: ['user', 'admin'] as const, default: 'user' },
  }
})
export type User = InferEntity<typeof User>

// Seed initial data
let seeded = false
export function seedData() {
  if (seeded) return
  seeded = true

  const store = useStore.getState()

  // Check if already has data
  const existing = store.getAll('User')
  if (existing.length > 0) return

  const silent = { silent: true }

  // Sample users
  store.create('User', {
    id: 'u1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    role: 'admin'
  }, silent)

  store.create('User', {
    id: 'u2',
    name: 'Bob Jones',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    role: 'user'
  }, silent)
}
