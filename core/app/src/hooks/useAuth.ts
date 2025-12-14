// Universal auth hook for prototypes
// Provides simple authentication state with localStorage persistence
// Supports namespaces for dual-app scenarios (driver/passenger, etc.)

import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: Record<string, unknown> | null
  setUser: (user: Record<string, unknown> | null) => void
}

// Cache of stores by namespace
const storeCache = new Map<string, UseBoundStore<StoreApi<AuthStore>>>()

// Factory to get or create store by namespace
function getAuthStore(namespace: string): UseBoundStore<StoreApi<AuthStore>> {
  if (!storeCache.has(namespace)) {
    const store = create<AuthStore>()(
      persist(
        (set) => ({
          user: null,
          setUser: (user) => set({ user }),
        }),
        { name: `auth-${namespace}` }
      )
    )
    storeCache.set(namespace, store)
  }
  return storeCache.get(namespace)!
}

// Default store for backward compatibility (no namespace)
const defaultStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'auth' }
  )
)

interface UseAuthConfig<T> {
  /** Extract role from user object. Default: (user) => user.role ?? 'user' */
  getRole?: (user: T) => string
  /**
   * Namespace for separate auth storage.
   * Use for dual-app scenarios: 'driver', 'passenger', 'admin', etc.
   * Each namespace gets its own localStorage key: `auth-{namespace}`
   */
  namespace?: string
}

/**
 * Universal auth hook for prototypes
 *
 * @example
 * // Basic usage
 * interface User {
 *   id: string
 *   name: string
 *   email: string
 *   role: 'admin' | 'user'
 * }
 *
 * const { user, isAuthenticated, login, logout } = useAuth<User>()
 *
 * // Login
 * login({ id: '1', name: 'John', email: 'john@test.com', role: 'admin' })
 *
 * // Check role
 * if (hasRole('admin')) { ... }
 *
 * @example
 * // Dual-app with namespace (driver/passenger)
 * // Driver app - stored in localStorage as 'auth-driver'
 * const driverAuth = useAuth<Driver>({ namespace: 'driver' })
 *
 * // Passenger app - stored in localStorage as 'auth-passenger'
 * const passengerAuth = useAuth<Passenger>({ namespace: 'passenger' })
 *
 * // Both can be logged in simultaneously with different users
 *
 * @example
 * // Custom role field
 * interface Seller {
 *   id: string
 *   shopName: string
 *   subscription: 'free' | 'pro' | 'enterprise'
 * }
 *
 * const { hasRole } = useAuth<Seller>({
 *   getRole: (seller) => seller.subscription
 * })
 *
 * if (hasRole('pro')) { ... }
 */
export function useAuth<T extends { id: string }>(config?: UseAuthConfig<T>) {
  // Use namespaced store or default store
  const store = config?.namespace ? getAuthStore(config.namespace) : defaultStore
  const user = store((s) => s.user) as T | null
  const setUser = store((s) => s.setUser)

  const getRole = config?.getRole ?? ((u: T) => (u as Record<string, unknown>).role as string ?? 'user')

  return {
    /** Current user or null */
    user,

    /** Is user logged in */
    isAuthenticated: !!user,

    /** Current role (or 'guest' if not authenticated) */
    role: user ? getRole(user) : 'guest',

    /**
     * Login user - saves to localStorage
     * @example login({ id: '1', name: 'Admin', role: 'admin' })
     */
    login: (userData: T) => setUser(userData as Record<string, unknown>),

    /** Logout - clears user data */
    logout: () => setUser(null),

    /**
     * Check if current user has specific role
     * @example if (hasRole('admin')) { ... }
     */
    hasRole: (role: string): boolean => {
      if (!user) return role === 'guest'
      return getRole(user) === role
    },

    /**
     * Check if current user has one of the roles
     * @example if (isOneOf('admin', 'moderator')) { ... }
     */
    isOneOf: (...roles: string[]): boolean => {
      const currentRole = user ? getRole(user) : 'guest'
      return roles.includes(currentRole)
    },

    /**
     * Update current user data (partial update)
     * @example updateUser({ name: 'New Name' })
     */
    updateUser: (data: Partial<T>) => {
      if (user) {
        setUser({ ...user, ...data } as Record<string, unknown>)
      }
    },
  }
}

// Re-export for convenience
export type { UseAuthConfig }
