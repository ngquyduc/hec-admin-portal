import { useMemo } from 'react'
import { useCurrentUser } from '@/hooks/useAuth'
import { createAuthAccess } from '@/lib/rbac'

export function usePermissions() {
  const { data: user } = useCurrentUser()

  return useMemo(() => createAuthAccess(user ?? null), [user])
}
