// Permission Guard - for fine-grained access control
import { ReactNode } from 'react'
import { useAuthStore } from '@prototype/stores/auth.store'
import type { Permission } from '@prototype/config/roles'

interface PermissionGuardProps {
  children: ReactNode
  permission: Permission
  fallback?: ReactNode  // What to show when no permission
}

// HOC for conditional rendering based on permission
export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission)

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook version for more flexibility
export function useHasPermission(permission: Permission): boolean {
  return useAuthStore((s) => s.hasPermission)(permission)
}

// Multiple permissions check
export function useHasPermissions(permissions: Permission[], requireAll = true): boolean {
  const hasPermission = useAuthStore((s) => s.hasPermission)

  if (requireAll) {
    return permissions.every((p) => hasPermission(p))
  }
  return permissions.some((p) => hasPermission(p))
}
