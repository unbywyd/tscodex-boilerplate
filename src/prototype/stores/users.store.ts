// Example Zustand store - simple pattern for LLM to replicate
import { create } from 'zustand'

// 1. Define types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

// 2. Define store state and actions
interface UsersState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null

  // Actions
  setUsers: (users: User[]) => void
  selectUser: (user: User | null) => void
  addUser: (user: User) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// 3. Create store
export const useUsersStore = create<UsersState>((set) => ({
  // Initial state
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  // Actions
  setUsers: (users) => set({ users }),

  selectUser: (user) => set({ selectedUser: user }),

  addUser: (user) => set((state) => ({
    users: [...state.users, user]
  })),

  updateUser: (id, data) => set((state) => ({
    users: state.users.map((u) =>
      u.id === id ? { ...u, ...data } : u
    ),
  })),

  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))

// 4. Selectors (optional, for computed values)
export const useUserById = (id: string) =>
  useUsersStore((state) => state.users.find((u) => u.id === id))

export const useAdminUsers = () =>
  useUsersStore((state) => state.users.filter((u) => u.role === 'admin'))
