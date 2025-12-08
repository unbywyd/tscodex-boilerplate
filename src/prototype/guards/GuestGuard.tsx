// Guest Guard - only for unauthenticated users (login, register pages)
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@prototype/stores/auth.store'
import { REDIRECT } from '@prototype/config/routes'

interface GuestGuardProps {
  children: ReactNode
  redirectTo?: string  // Override default redirect
}

export function GuestGuard({ children, redirectTo }: GuestGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (isAuthenticated) {
    // If user came from a protected page, redirect there
    const from = (location.state as { from?: Location })?.from?.pathname
    return <Navigate to={from ?? redirectTo ?? REDIRECT.afterLogin} replace />
  }

  return <>{children}</>
}
