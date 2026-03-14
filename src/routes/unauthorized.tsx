import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const reasonMessages = {
  insufficient_role: 'You do not have the required role to access this page.',
  insufficient_permissions: 'You do not have the required permissions to access this page.',
  default: 'You are not authorized to access this page.',
}

export const Route = createFileRoute('/unauthorized')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/',
    reason: typeof search.reason === 'string' ? search.reason : 'default',
  }),
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  const { redirect, reason } = Route.useSearch()
  const message = reasonMessages[reason as keyof typeof reasonMessages] ?? reasonMessages.default

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to={redirect}>Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
