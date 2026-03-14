import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parentService } from '@/services/parent.service'
import type { CreateParent, UpdateParent } from '@/types/entities'

const PARENTS_QUERY_KEY = ['parents'] as const

export function useParents() {
  return useQuery({
    queryKey: PARENTS_QUERY_KEY,
    queryFn: () => parentService.getAll(),
  })
}

export function useParentById(id: string) {
  return useQuery({
    queryKey: [...PARENTS_QUERY_KEY, id],
    queryFn: () => parentService.getById(id),
    enabled: !!id,
  })
}

export function useParentsSearch(query: string) {
  return useQuery({
    queryKey: [...PARENTS_QUERY_KEY, 'search', query],
    queryFn: () => parentService.search(query),
    enabled: query.length > 0,
  })
}

export function useCreateParent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateParent) => parentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY })
    },
  })
}

export function useUpdateParent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParent }) =>
      parentService.update(id, data),
    onSuccess: (updatedParent) => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY })
      queryClient.setQueryData([...PARENTS_QUERY_KEY, updatedParent.id], updatedParent)
    },
  })
}

export function useDeleteParent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => parentService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...PARENTS_QUERY_KEY, deletedId] })
    },
  })
}

export function useAddStudentToParent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ parentId, studentId }: { parentId: string; studentId: string }) =>
      parentService.addStudent(parentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useRemoveStudentFromParent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ parentId, studentId }: { parentId: string; studentId: string }) =>
      parentService.removeStudent(parentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
