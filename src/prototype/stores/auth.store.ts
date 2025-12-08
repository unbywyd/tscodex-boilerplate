// Auth store - manages authentication state
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Role, hasRole, hasPermission, type Permission } from '@prototype/config/roles'

// User type - extend as needed
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (data: Partial<AuthUser>) => void
  setLoading: (loading: boolean) => void

  // Helpers (computed-like)
  hasRole: (role: Role) => boolean
  hasPermission: (permission: Permission) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) => set({
        user,
        isAuthenticated: true,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
      }),

      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),

      setLoading: (isLoading) => set({ isLoading }),

      // Check if current user has at least this role
      hasRole: (role) => {
        const user = get().user
        if (!user) return role === Role.GUEST
        return hasRole(user.role, role)
      },

      // Check if current user has permission
      hasPermission: (permission) => {
        const user = get().user
        if (!user) return false
        return hasPermission(user.role, permission)
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Selectors for common use cases
export const useUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useUserRole = () => useAuthStore((s) => s.user?.role ?? Role.GUEST)
