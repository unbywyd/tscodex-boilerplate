// Universal Repository with localStorage persistence
// Provides CRUD operations for any entity type

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Base entity interface - all entities must have id
export interface BaseEntity {
  id: string
  createdAt?: string
  updatedAt?: string
}

// Repository state
interface RepositoryState<T extends BaseEntity> {
  data: T[]
  initialized: boolean
}

// Repository actions
interface RepositoryActions<T extends BaseEntity> {
  // Initialize with mock data (only if empty)
  init: (mockData: T[]) => void
  // Reset to mock data (force)
  reset: (mockData: T[]) => void

  // Read operations
  getAll: () => T[]
  getById: (id: string) => T | undefined
  getWhere: (predicate: (item: T) => boolean) => T[]
  getFirst: (predicate: (item: T) => boolean) => T | undefined
  count: () => number

  // Write operations
  create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id'>>) => T
  update: (id: string, updates: Partial<Omit<T, 'id'>>) => T | undefined
  patch: (id: string, updates: Partial<Omit<T, 'id'>>) => T | undefined // alias for update
  delete: (id: string) => boolean
  deleteWhere: (predicate: (item: T) => boolean) => number
  deleteAll: () => void

  // Bulk operations
  createMany: (items: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) => T[]
  updateMany: (ids: string[], updates: Partial<Omit<T, 'id'>>) => T[]
  deleteMany: (ids: string[]) => number
}

type RepositoryStore<T extends BaseEntity> = RepositoryState<T> & RepositoryActions<T>

// Generate CUID-like ID
function generateId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `c${timestamp}${randomPart}`
}

// Get current ISO timestamp
function now(): string {
  return new Date().toISOString()
}

// Repository instances cache (using 'any' to avoid generic variance issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const repositories = new Map<string, any>()

// Create a repository for a specific entity type
function createRepository<T extends BaseEntity>(name: string) {
  return create<RepositoryStore<T>>()(
    persist(
      (set, get) => ({
        data: [],
        initialized: false,

        // Initialize with mock data (only if not initialized)
        init: (mockData: T[]) => {
          const state = get()
          if (!state.initialized || state.data.length === 0) {
            set({ data: mockData, initialized: true })
          }
        },

        // Reset to mock data (force overwrite)
        reset: (mockData: T[]) => {
          set({ data: mockData, initialized: true })
        },

        // Read operations
        getAll: () => get().data,

        getById: (id: string) => get().data.find(item => item.id === id),

        getWhere: (predicate: (item: T) => boolean) => get().data.filter(predicate),

        getFirst: (predicate: (item: T) => boolean) => get().data.find(predicate),

        count: () => get().data.length,

        // Create
        create: (item) => {
          const newItem = {
            ...item,
            id: (item as any).id || generateId(),
            createdAt: now(),
            updatedAt: now(),
          } as T

          set(state => ({ data: [...state.data, newItem] }))
          return newItem
        },

        // Update
        update: (id: string, updates) => {
          let updated: T | undefined
          set(state => ({
            data: state.data.map(item => {
              if (item.id === id) {
                updated = { ...item, ...updates, updatedAt: now() }
                return updated
              }
              return item
            })
          }))
          return updated
        },

        // Patch (alias for update)
        patch: (id: string, updates) => get().update(id, updates),

        // Delete
        delete: (id: string) => {
          const exists = get().data.some(item => item.id === id)
          if (exists) {
            set(state => ({ data: state.data.filter(item => item.id !== id) }))
          }
          return exists
        },

        // Delete where
        deleteWhere: (predicate) => {
          const toDelete = get().data.filter(predicate)
          set(state => ({ data: state.data.filter(item => !predicate(item)) }))
          return toDelete.length
        },

        // Delete all
        deleteAll: () => set({ data: [] }),

        // Bulk create
        createMany: (items) => {
          const newItems = items.map(item => ({
            ...item,
            id: generateId(),
            createdAt: now(),
            updatedAt: now(),
          })) as T[]

          set(state => ({ data: [...state.data, ...newItems] }))
          return newItems
        },

        // Bulk update
        updateMany: (ids: string[], updates) => {
          const updated: T[] = []
          set(state => ({
            data: state.data.map(item => {
              if (ids.includes(item.id)) {
                const updatedItem = { ...item, ...updates, updatedAt: now() }
                updated.push(updatedItem)
                return updatedItem
              }
              return item
            })
          }))
          return updated
        },

        // Bulk delete
        deleteMany: (ids: string[]) => {
          const count = get().data.filter(item => ids.includes(item.id)).length
          set(state => ({ data: state.data.filter(item => !ids.includes(item.id)) }))
          return count
        },
      }),
      {
        name: `prototype-${name}`, // localStorage key
      }
    )
  )
}

// Get or create a repository for an entity type
export function getRepository<T extends BaseEntity>(name: string) {
  if (!repositories.has(name)) {
    repositories.set(name, createRepository<T>(name))
  }
  return repositories.get(name)! as ReturnType<typeof createRepository<T>>
}

// Hook to use repository in React components
export function useRepository<T extends BaseEntity>(name: string) {
  const store = getRepository<T>(name)
  return store()
}

// Initialize repository with mock data from server
export async function initRepositoryFromMock<T extends BaseEntity>(
  name: string,
  mockName?: string
): Promise<ReturnType<typeof createRepository<T>>> {
  const repo = getRepository<T>(name)
  const state = repo.getState()

  // Only load mock if not initialized
  if (!state.initialized || state.data.length === 0) {
    try {
      const response = await fetch(`/generated/mocks/${mockName || name}.json`)
      if (response.ok) {
        const mockData = await response.json()
        repo.getState().init(Array.isArray(mockData) ? mockData : [])
      }
    } catch (error) {
      console.warn(`Failed to load mock data for ${name}:`, error)
    }
  }

  return repo
}

// Clear all repository data (for testing/reset)
export function clearAllRepositories() {
  repositories.forEach((_, name) => {
    localStorage.removeItem(`prototype-${name}`)
  })
  repositories.clear()
}

// Export data from all repositories
export function exportAllData(): Record<string, any[]> {
  const data: Record<string, any[]> = {}
  repositories.forEach((repo, name) => {
    data[name] = repo.getState().data
  })
  return data
}
