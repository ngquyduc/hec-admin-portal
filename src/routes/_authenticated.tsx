import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
  useNavigate,
} from '@tanstack/react-router'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { AUTH_QUERY_KEY, useCurrentUser } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { buildLoginRedirectPath } from '@/lib/utils'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const user = await context.queryClient.ensureQueryData({
        queryKey: AUTH_QUERY_KEY,
        queryFn: () => authService.getCurrentUser(),
        staleTime: 1000 * 60 * 5,
        retry: false,
      })

      if (!user) {
        throw redirect({
          to: '/login',
          search: { redirect: buildLoginRedirectPath(location.href) },
        })
      }

      return { user }
    } catch (error) {
      if (isRedirect(error)) throw error
      throw redirect({
        to: '/login',
        search: { redirect: buildLoginRedirectPath(location.href) },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (isLoading || user || typeof window === 'undefined') {
      return
    }

    navigate({
      to: '/login',
      search: { redirect: buildLoginRedirectPath(window.location.href) },
      replace: true,
    })
  }, [isLoading, user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading your session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <>
      <Header />
      <Navigation />
      <Outlet />
    </>
  )
}
