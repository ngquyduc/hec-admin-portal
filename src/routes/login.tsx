import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSignIn, useCurrentUser, useSendOtp, useVerifyOtp } from '@/hooks/useAuth'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Step = 'email' | 'password' | 'otp-code'

function LoginPage() {
  const navigate = useNavigate()
  const signIn = useSignIn()
  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()
  const { data: user, isLoading } = useCurrentUser()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: user.role === 'admin' ? '/' : '/teacher' })
    }
  }, [user, isLoading, navigate])

  useEffect(() => {
    if (step === 'otp-code') {
      setTimeout(() => otpRef.current?.focus(), 50)
    }
  }, [step])

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStep('password')
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const loggedInUser = await signIn.mutateAsync({ email, password })
      toast.success('Signed in successfully')
      navigate({ to: loggedInUser.role === 'admin' ? '/' : '/teacher' })
    } catch (err: any) {
      toast.error(err.message ?? 'Invalid email or password')
    }
  }

  const handleSendOtp = async () => {
    try {
      const result = await sendOtp.mutateAsync(email)
      setStep('otp-code')

      if (result.mode === 'login') {
        toast.success('Check your email for a sign-in code')
      } else {
        toast.success('No account found. We sent you a signup code to continue.')
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to send code')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const loggedInUser = await verifyOtp.mutateAsync({ email, token: otp })
      toast.success('Signed in successfully')
      navigate({ to: loggedInUser.role === 'admin' ? '/' : '/teacher' })
    } catch (err: any) {
      toast.error(err.message ?? 'Invalid or expired code')
    }
  }

  const handleBack = () => {
    setPassword('')
    setOtp('')
    setStep('email')
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
          {/* Step 1 — email */}
          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="you@hec.com"
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {/* Step 2a — password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground flex-1 truncate">{email}</span>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs text-primary underline-offset-4 hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={signIn.isPending}>
                {signIn.isPending ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={sendOtp.isPending}
                onClick={handleSendOtp}
              >
                {sendOtp.isPending ? 'Sending code...' : 'Email me a sign-in code'}
              </Button>
            </form>
          )}

          {/* Step 2b — OTP code */}
          {step === 'otp-code' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground flex-1 truncate">{email}</span>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs text-primary underline-offset-4 hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp">Sign-in code</Label>
                <Input
                  id="otp"
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="123456"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  We sent a 6-digit code to <span className="font-medium">{email}</span>. It expires in 10 minutes.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={verifyOtp.isPending || otp.length < 6}>
                {verifyOtp.isPending ? 'Verifying...' : 'Continue'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                disabled={sendOtp.isPending}
                onClick={handleSendOtp}
              >
                {sendOtp.isPending ? 'Resending...' : 'Resend code'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

