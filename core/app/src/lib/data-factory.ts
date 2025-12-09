// Data Factory - generates fake data using faker.js
// Register factories for entity types to use with repository.populate()
//
// CORE MODULE - do not add specific entity factories here!
// Register factories in your prototype code instead.

import { faker } from '@faker-js/faker'
import type { BaseEntity } from './repository'

// Factory function type - generates entity data without id/timestamps
export type EntityFactory<T extends BaseEntity> = () => Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// Registry of factories by entity name
const factories = new Map<string, EntityFactory<any>>()

/**
 * Register a factory for an entity type
 *
 * @example
 * // In your prototype factories file:
 * registerFactory<User>('users', () => ({
 *   name: faker.person.fullName(),
 *   email: faker.internet.email(),
 *   role: faker.helpers.arrayElement(['admin', 'user']),
 *   avatar: faker.image.avatar(),
 * }))
 */
export function registerFactory<T extends BaseEntity>(
  name: string,
  factory: EntityFactory<T>
): void {
  factories.set(name, factory)
}

/**
 * Get a registered factory
 */
export function getFactory<T extends BaseEntity>(name: string): EntityFactory<T> | undefined {
  return factories.get(name)
}

/**
 * Check if factory exists
 */
export function hasFactory(name: string): boolean {
  return factories.has(name)
}

/**
 * Generate multiple entities using a factory
 */
export function generateMany<T extends BaseEntity>(
  name: string,
  count: number
): Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> {
  const factory = factories.get(name)
  if (!factory) {
    throw new Error(`No factory registered for "${name}". Use registerFactory() first.`)
  }
  return Array.from({ length: count }, () => factory())
}

/**
 * Generate a single entity using a factory
 */
export function generateOne<T extends BaseEntity>(
  name: string
): Omit<T, 'id' | 'createdAt' | 'updatedAt'> {
  const factory = factories.get(name)
  if (!factory) {
    throw new Error(`No factory registered for "${name}". Use registerFactory() first.`)
  }
  return factory()
}

// Re-export faker for convenience
export { faker }
