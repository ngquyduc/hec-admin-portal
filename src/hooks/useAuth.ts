import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'

export const AUTH_QUERY_KEY = ['auth', 'user'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.clear()
    },
  })
}

export function useIsAdmin() {
  const { data: user } = useCurrentUser()
  return user?.role === 'admin'
}

export function useIsTeacher() {
  const { data: user } = useCurrentUser()
  return user?.role === 'teacher'
}
