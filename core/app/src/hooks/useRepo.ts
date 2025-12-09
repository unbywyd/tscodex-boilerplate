// React hook for Repository
// Provides reactive CRUD operations with automatic mock data loading

import { useEffect, useState } from 'react'
import {
  useRepository,
  initRepositoryFromMock,
  type BaseEntity,
} from '@/lib/repository'
import { generateMany, hasFactory, type EntityFactory } from '@/lib/data-factory'

interface UseRepoOptions {
  // Mock file name (defaults to repository name)
  mockName?: string
  // Auto-load mock data on mount
  autoInit?: boolean
}

/**
 * Hook to use a repository with automatic mock data loading
 *
 * @example
 * // Basic usage - loads from /generated/mocks/users.json
 * const { data, create, update, delete: remove, populate } = useRepo<User>('users')
 *
 * @example
 * // Populate with 20 fake users
 * const { populate } = useRepo<User>('users')
 * populate(20) // Uses registered factory for 'users'
 *
 * @example
 * // Custom mock file
 * const { data } = useRepo<Product>('products', { mockName: 'sample-products' })
 *
 * @example
 * // Without auto-loading mocks
 * const { data, init } = useRepo<Task>('tasks', { autoInit: false })
 * // Then manually: init(myData)
 */
export function useRepo<T extends BaseEntity>(
  name: string,
  options: UseRepoOptions = {}
) {
  const { mockName, autoInit = true } = options
  const [loading, setLoading] = useState(autoInit)
  const [error, setError] = useState<Error | null>(null)

  // Get repository state and actions
  const store = useRepository<T>(name)

  // Auto-initialize from mock data
  useEffect(() => {
    if (!autoInit) {
      setLoading(false)
      return
    }

    const loadMock = async () => {
      try {
        await initRepositoryFromMock<T>(name, mockName)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadMock()
  }, [name, mockName, autoInit])

  /**
   * Populate repository with fake data using registered factory
   *
   * @param count - Number of entities to generate (default: 10)
   * @param replace - If true, replaces existing data. If false, appends (default: false)
   *
   * @example
   * populate(20) // Add 20 fake users
   * populate(10, true) // Replace all data with 10 fake users
   */
  const populate = (count: number = 10, replace: boolean = false): T[] => {
    if (!hasFactory(name)) {
      console.warn(`No factory registered for "${name}". Use registerFactory() to add one.`)
      return []
    }

    const items = generateMany<T>(name, count)

    if (replace) {
      store.deleteAll()
    }

    return store.createMany(items)
  }

  /**
   * Populate with custom factory (one-time use)
   *
   * @example
   * populateWith(5, () => ({
   *   name: 'Custom User',
   *   email: `user${Math.random()}@test.com`,
   *   role: 'user',
   * }))
   */
  const populateWith = (
    count: number,
    factory: EntityFactory<T>,
    replace: boolean = false
  ): T[] => {
    const items = Array.from({ length: count }, () => factory())

    if (replace) {
      store.deleteAll()
    }

    return store.createMany(items)
  }

  return {
    // State
    data: store.data,
    loading,
    error,
    initialized: store.initialized,
    count: store.count(),

    // Read operations
    getAll: store.getAll,
    getById: store.getById,
    getWhere: store.getWhere,
    getFirst: store.getFirst,

    // Write operations
    create: store.create,
    update: store.update,
    patch: store.patch,
    delete: store.delete,
    deleteWhere: store.deleteWhere,
    deleteAll: store.deleteAll,

    // Bulk operations
    createMany: store.createMany,
    updateMany: store.updateMany,
    deleteMany: store.deleteMany,

    // Populate with fake data
    populate,
    populateWith,

    // Control
    init: store.init,
    reset: store.reset,
  }
}

/**
 * Hook to get a single item by ID
 *
 * @example
 * const { item, loading, update, delete: remove } = useRepoItem<User>('users', userId)
 */
export function useRepoItem<T extends BaseEntity>(
  name: string,
  id: string | null | undefined,
  options: UseRepoOptions = {}
) {
  const repo = useRepo<T>(name, options)
  const item = id ? repo.getById(id) : undefined

  return {
    item,
    loading: repo.loading,
    error: repo.error,
    exists: !!item,
    update: (updates: Partial<Omit<T, 'id'>>) => id ? repo.update(id, updates) : undefined,
    patch: (updates: Partial<Omit<T, 'id'>>) => id ? repo.patch(id, updates) : undefined,
    delete: () => id ? repo.delete(id) : false,
  }
}

// Re-export types and factory functions
export type { BaseEntity } from '@/lib/repository'
export { registerFactory, faker } from '@/lib/data-factory'
