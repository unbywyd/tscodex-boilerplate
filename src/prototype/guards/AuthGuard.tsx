// Auth Guard - protects routes requiring authentication
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@prototype/stores/auth.store'
import { REDIRECT } from '@prototype/config/routes'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode  // Loading state
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) {
    return fallback ?? <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!isAuthenticated) {
    // Redirect to login, save intended destination
    return <Navigate to={REDIRECT.unauthorized} state={{ from: location }} replace />
  }

  return <>{children}</>
}
