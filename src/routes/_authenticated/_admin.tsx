import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AUTH_QUERY_KEY } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: async ({ context, location }) => {
    if (typeof window === 'undefined') {
      return
    }

    const user = await context.queryClient.ensureQueryData({
      queryKey: AUTH_QUERY_KEY,
      queryFn: () => authService.getCurrentUser(),
      staleTime: 1000 * 60 * 5,
      retry: false,
    })

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/teacher' })
    }
  },
  component: AdminGuardLayout,
})

function AdminGuardLayout() {
  const { data: user, isLoading } = useCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      navigate({
        to: '/login',
        search: { redirect: location.href },
      })
      return
    }

    if (user.role !== 'admin') {
      navigate({ to: '/teacher' })
    }
  }, [isLoading, user, navigate, location.href])

  if (isLoading || !user || user.role !== 'admin') {
    return null
  }

  return <Outlet />
}
