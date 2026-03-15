import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AUTH_QUERY_KEY } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { buildLoginRedirectPath } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/_teacher')({
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
        search: { redirect: buildLoginRedirectPath(location.href) },
      })
    }
  },
  component: () => <Outlet />,
})
