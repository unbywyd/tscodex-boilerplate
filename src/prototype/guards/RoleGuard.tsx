// Role Guard - protects routes requiring specific role
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@prototype/stores/auth.store'
import { Role } from '@prototype/config/roles'
import { REDIRECT } from '@prototype/config/routes'

interface RoleGuardProps {
  children: ReactNode
  requiredRole: Role
  fallback?: ReactNode  // What to show when access denied (instead of redirect)
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={REDIRECT.unauthorized} replace />
  }

  // Authenticated but wrong role
  if (!hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>
    return <Navigate to={REDIRECT.forbidden} replace />
  }

  return <>{children}</>
}
