// Route configuration with guards and roles
import { ComponentType, LazyExoticComponent, lazy } from 'react'
import { Role } from './roles'

// Route access types
export type RouteAccess =
  | 'public'        // Anyone can access
  | 'guest'         // Only unauthenticated users (login, register)
  | 'authenticated' // Any authenticated user
  | 'role'          // Specific role required (use requiredRole)

// Route meta configuration
export interface RouteMeta {
  access: RouteAccess
  requiredRole?: Role         // For access: 'role'
  redirectTo?: string         // Redirect if access denied
  title?: string              // Page title
  showInNav?: boolean         // Show in navigation
  icon?: string               // Icon name for navigation
}

// Route definition
export interface RouteConfig {
  path: string
  component: LazyExoticComponent<ComponentType> | ComponentType
  meta: RouteMeta
  children?: RouteConfig[]
}

// Default redirect paths
export const REDIRECT = {
  afterLogin: '/prototype/dashboard',
  afterLogout: '/prototype',
  unauthorized: '/prototype/login',
  forbidden: '/prototype/403',
} as const

// Lazy load pages (for code splitting)
const lazyPage = (path: string) =>
  lazy(() => import(`@prototype/pages/${path}`).catch(() => import(`@prototype/pages/NotFound`)))

// Route definitions - extend this for your project
export const routes: RouteConfig[] = [
  // Public routes
  {
    path: '/prototype',
    component: lazyPage('Home'),
    meta: {
      access: 'public',
      title: 'Home',
      showInNav: true,
    },
  },

  // Guest only routes (redirect if authenticated)
  {
    path: '/prototype/login',
    component: lazyPage('auth/Login'),
    meta: {
      access: 'guest',
      title: 'Login',
      redirectTo: REDIRECT.afterLogin,
    },
  },
  {
    path: '/prototype/register',
    component: lazyPage('auth/Register'),
    meta: {
      access: 'guest',
      title: 'Register',
      redirectTo: REDIRECT.afterLogin,
    },
  },

  // Authenticated routes
  {
    path: '/prototype/dashboard',
    component: lazyPage('Dashboard'),
    meta: {
      access: 'authenticated',
      title: 'Dashboard',
      showInNav: true,
      icon: 'LayoutDashboard',
    },
  },
  {
    path: '/prototype/profile',
    component: lazyPage('Profile'),
    meta: {
      access: 'authenticated',
      title: 'Profile',
    },
  },

  // Role-based routes
  {
    path: '/prototype/admin',
    component: lazyPage('admin/AdminDashboard'),
    meta: {
      access: 'role',
      requiredRole: Role.ADMIN,
      title: 'Admin Panel',
      showInNav: true,
      icon: 'Shield',
    },
  },
  {
    path: '/prototype/admin/users',
    component: lazyPage('admin/Users'),
    meta: {
      access: 'role',
      requiredRole: Role.ADMIN,
      title: 'User Management',
    },
  },

  // Error pages
  {
    path: '/prototype/403',
    component: lazyPage('errors/Forbidden'),
    meta: { access: 'public', title: 'Access Denied' },
  },
  {
    path: '/prototype/404',
    component: lazyPage('errors/NotFound'),
    meta: { access: 'public', title: 'Not Found' },
  },
]

// Helper: Get route by path
export function getRouteConfig(path: string): RouteConfig | undefined {
  return routes.find((r) => r.path === path)
}

// Helper: Get navigation routes
export function getNavRoutes(userRole?: Role): RouteConfig[] {
  return routes.filter((route) => {
    if (!route.meta.showInNav) return false
    if (route.meta.access === 'authenticated' && !userRole) return false
    if (route.meta.access === 'role' && route.meta.requiredRole) {
      if (!userRole) return false
      // Simple role check - admin sees all
      if (userRole !== Role.ADMIN && route.meta.requiredRole === Role.ADMIN) return false
    }
    return true
  })
}
