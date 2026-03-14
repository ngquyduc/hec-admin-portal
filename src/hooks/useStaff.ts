import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { staffService } from '@/services/staff.service'
import type { CreateStaff, UpdateStaff } from '@/types/entities'

const STAFF_QUERY_KEY = ['staff'] as const

export function useStaff() {
  return useQuery({
    queryKey: STAFF_QUERY_KEY,
    queryFn: () => staffService.getAll(),
  })
}

export function useStaffById(id: string) {
  return useQuery({
    queryKey: [...STAFF_QUERY_KEY, id],
    queryFn: () => staffService.getById(id),
    enabled: !!id,
  })
}

export function useStaffByStatus(status: 'active' | 'inactive' | 'suspended') {
  return useQuery({
    queryKey: [...STAFF_QUERY_KEY, 'status', status],
    queryFn: () => staffService.getByStatus(status),
  })
}

export function useStaffSearch(query: string) {
  return useQuery({
    queryKey: [...STAFF_QUERY_KEY, 'search', query],
    queryFn: () => staffService.search(query),
    enabled: query.length > 0,
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStaff) => staffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
    },
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaff }) =>
      staffService.update(id, data),
    onSuccess: (updatedStaff) => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
      queryClient.setQueryData([...STAFF_QUERY_KEY, updatedStaff.id], updatedStaff)
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => staffService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...STAFF_QUERY_KEY, deletedId] })
    },
  })
}
