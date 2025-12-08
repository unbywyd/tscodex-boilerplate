// Auth service - mock implementation, replace with real API
import { Role } from '@prototype/config/roles'
import { useAuthStore, type AuthUser } from '@prototype/stores/auth.store'

// Mock users for development
const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: Role.ADMIN,
    password: 'admin123',
  },
  'user@example.com': {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: Role.USER,
    password: 'user123',
  },
}

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const authService = {
  // Login with email/password
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(500) // Simulate API call

    const mockUser = MOCK_USERS[email]
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid email or password')
    }

    const { password: _, ...user } = mockUser
    useAuthStore.getState().login(user)
    return user
  },

  // Logout
  async logout(): Promise<void> {
    await delay(200)
    useAuthStore.getState().logout()
  },

  // Register new user
  async register(data: { email: string; name: string; password: string }): Promise<AuthUser> {
    await delay(500)

    if (MOCK_USERS[data.email]) {
      throw new Error('Email already exists')
    }

    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: Role.USER,
    }

    // In real app, this would be saved to backend
    useAuthStore.getState().login(newUser)
    return newUser
  },

  // Get current user (e.g., on app init)
  async getCurrentUser(): Promise<AuthUser | null> {
    await delay(200)
    return useAuthStore.getState().user
  },

  // Update profile
  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    await delay(300)

    const { updateUser, user } = useAuthStore.getState()
    if (!user) throw new Error('Not authenticated')

    updateUser(data)
    return { ...user, ...data }
  },

  // Check if email is available
  async checkEmail(email: string): Promise<boolean> {
    await delay(200)
    return !MOCK_USERS[email]
  },
}
