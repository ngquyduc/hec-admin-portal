import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedbackService } from '@/services/feedback.service'
import type { CreateFeedback } from '@/types/entities'

export const FEEDBACK_QUERY_KEY = ['feedback'] as const

export function useFeedbackByUserId(userId: string) {
  return useQuery({
    queryKey: [...FEEDBACK_QUERY_KEY, userId],
    queryFn: () => feedbackService.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useCreateFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeedback) => feedbackService.create(data),
    onSuccess: (createdFeedback) => {
      queryClient.invalidateQueries({ queryKey: [...FEEDBACK_QUERY_KEY, createdFeedback.userId] })
    },
  })
}
