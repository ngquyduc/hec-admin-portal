import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import Navigation from '../components/Navigation'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'
import { Toaster } from 'sonner'
import { useCurrentUser } from '@/hooks/useAuth'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    if (isLoading) return
    if (!user && !isLoginPage) {
      navigate({ to: '/login' })
    }
    if (user && isLoginPage) {
      navigate({ to: user.role === 'admin' ? '/' : '/teacher' })
    }
  }, [user, isLoading, isLoginPage, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!user && !isLoginPage) return null

  if (isLoginPage) return <>{children}</>

  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthGuard>{children}</AuthGuard>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  )
}
