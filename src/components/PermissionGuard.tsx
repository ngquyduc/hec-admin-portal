import type { ReactNode } from 'react'
import type { UserRole } from '@/types/auth'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGuardProps {
  children: ReactNode
  roles?: UserRole[]
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function PermissionGuard({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { hasAnyRole, hasAnyPermission, hasRole, hasPermission } = usePermissions()

  const hasRequiredRoles =
    roles.length === 0 ||
    (requireAll ? roles.every((role) => hasRole(role)) : hasAnyRole(roles))

  const hasRequiredPermissions =
    permissions.length === 0 ||
    (requireAll
      ? permissions.every((permission) => hasPermission(permission))
      : hasAnyPermission(permissions))

  if (hasRequiredRoles && hasRequiredPermissions) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
