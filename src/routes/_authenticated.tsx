import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import { AUTH_QUERY_KEY, useCurrentUser } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'

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
          search: { redirect: location.href },
        })
      }

      return { user }
    } catch (error) {
      if (isRedirect(error)) throw error
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
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
    }
  }, [isLoading, user, navigate, location.href])

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
