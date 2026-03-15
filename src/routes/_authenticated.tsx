import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
} from '@tanstack/react-router'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { AUTH_QUERY_KEY, useCurrentUser } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { buildLoginRedirectPath } from '@/lib/utils'

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
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading || !user) {
    return null
  }

  return (
    <>
      <Header />
      <Navigation />
      <Outlet />
    </>
  )
}
