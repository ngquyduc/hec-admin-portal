import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { entryTestService } from '@/services/entry-test.service'
import type {
  CreateEntryTestCandidate,
  UpdateEntryTestCandidate,
} from '@/types/entities'

const ENTRY_TESTS_QUERY_KEY = ['entry-tests'] as const

export function useEntryTests() {
  return useQuery({
    queryKey: ENTRY_TESTS_QUERY_KEY,
    queryFn: () => entryTestService.getAll(),
  })
}

export function useEntryTestById(id: string) {
  return useQuery({
    queryKey: [...ENTRY_TESTS_QUERY_KEY, id],
    queryFn: () => entryTestService.getById(id),
    enabled: !!id,
  })
}

export function useCreateEntryTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEntryTestCandidate) => entryTestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTRY_TESTS_QUERY_KEY })
    },
  })
}

export function useUpdateEntryTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntryTestCandidate }) =>
      entryTestService.update(id, data),
    onSuccess: (updatedEntryTest) => {
      queryClient.invalidateQueries({ queryKey: ENTRY_TESTS_QUERY_KEY })
      queryClient.setQueryData(
        [...ENTRY_TESTS_QUERY_KEY, updatedEntryTest.id],
        updatedEntryTest,
      )
    },
  })
}

export function useDeleteEntryTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => entryTestService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ENTRY_TESTS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...ENTRY_TESTS_QUERY_KEY, deletedId] })
    },
  })
}
