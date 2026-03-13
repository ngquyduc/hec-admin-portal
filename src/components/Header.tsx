import { useSignOut, useCurrentUser } from '@/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

export default function Header() {
  const { data: user } = useCurrentUser()
  const signOut = useSignOut()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut.mutateAsync()
    navigate({ to: '/login' })
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900">HEC Admin Portal</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {user.email}
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded capitalize">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
