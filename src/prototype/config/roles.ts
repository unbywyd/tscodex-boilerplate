// Role definitions - extend this enum for your project
export enum Role {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  // Add more roles as needed:
  // MODERATOR = 'moderator',
  // SUPER_ADMIN = 'super_admin',
}

// Role hierarchy - higher index = more permissions
export const ROLE_HIERARCHY: Role[] = [
  Role.GUEST,
  Role.USER,
  Role.ADMIN,
]

// Check if role has at least the required level
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole)
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole)
  return userLevel >= requiredLevel
}

// Permission definitions (optional, for fine-grained control)
export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'products:read'
  | 'products:write'
  | 'admin:access'
  // Add more permissions as needed

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.GUEST]: [],
  [Role.USER]: ['users:read', 'products:read'],
  [Role.ADMIN]: ['users:read', 'users:write', 'users:delete', 'products:read', 'products:write', 'admin:access'],
}

// Check if role has permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
