import type { AuthUser, UserRole } from '@/types/auth'

export type AppPermission = string

export interface AuthAccess {
  isAuthenticated: boolean
  user: AuthUser | null
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasPermission: (permission: AppPermission) => boolean
  hasAnyPermission: (permissions: AppPermission[]) => boolean
}

export function createAuthAccess(user: AuthUser | null): AuthAccess {
  const permissionSet = new Set(user?.permissions ?? [])

  return {
    isAuthenticated: Boolean(user),
    user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    hasPermission: (permission) => permissionSet.has(permission),
    hasAnyPermission: (permissions) => permissions.some((permission) => permissionSet.has(permission)),
  }
}
