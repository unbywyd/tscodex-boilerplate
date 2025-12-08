// Universal Route Guard - wraps routes based on config
import { ReactNode, Suspense } from 'react'
import { AuthGuard } from './AuthGuard'
import { GuestGuard } from './GuestGuard'
import { RoleGuard } from './RoleGuard'
import type { RouteMeta } from '@prototype/config/routes'

interface RouteGuardProps {
  children: ReactNode
  meta: RouteMeta
}

// Loading fallback for lazy loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

// Main guard component - apply based on route meta
export function RouteGuard({ children, meta }: RouteGuardProps) {
  const content = <Suspense fallback={<PageLoader />}>{children}</Suspense>

  switch (meta.access) {
    case 'public':
      return content

    case 'guest':
      return (
        <GuestGuard redirectTo={meta.redirectTo}>
          {content}
        </GuestGuard>
      )

    case 'authenticated':
      return (
        <AuthGuard>
          {content}
        </AuthGuard>
      )

    case 'role':
      return (
        <RoleGuard requiredRole={meta.requiredRole!}>
          {content}
        </RoleGuard>
      )

    default:
      return content
  }
}
