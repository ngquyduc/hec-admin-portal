import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignIn, useCurrentUser } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const signIn = useSignIn()
  const { data: user, isLoading } = useCurrentUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: user.role === 'admin' ? '/' : '/teacher' })
    }
  }, [user, isLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const loggedInUser = await signIn.mutateAsync({ email, password })
      toast.success('Signed in successfully')
      navigate({ to: loggedInUser.role === 'admin' ? '/' : '/teacher' })
    } catch (err: any) {
      toast.error(err.message ?? 'Invalid email or password')
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">HEC Portal</CardTitle>
          <CardDescription>
            English Tutoring Center — Sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@hec.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={signIn.isPending}>
              {signIn.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
