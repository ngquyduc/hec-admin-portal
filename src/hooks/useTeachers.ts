import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teacherService } from '@/services/teacher.service'
import type { CreateTeacher, UpdateTeacher } from '@/types/entities'

const TEACHERS_QUERY_KEY = ['teachers'] as const

export function useTeachers() {
  return useQuery({
    queryKey: TEACHERS_QUERY_KEY,
    queryFn: () => teacherService.getAll(),
  })
}

export function useTeacherById(id: string) {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, id],
    queryFn: () => teacherService.getById(id),
    enabled: !!id,
  })
}

export function useTeachersByStatus(status: 'active' | 'inactive' | 'suspended') {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, 'status', status],
    queryFn: () => teacherService.getByStatus(status),
  })
}

export function useTeachersBySubject(subject: string) {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, 'subject', subject],
    queryFn: () => teacherService.getBySubject(subject),
    enabled: !!subject,
  })
}

export function useTeachersSearch(query: string) {
  return useQuery({
    queryKey: [...TEACHERS_QUERY_KEY, 'search', query],
    queryFn: () => teacherService.search(query),
    enabled: query.length > 0,
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTeacher) => teacherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY })
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacher }) =>
      teacherService.update(id, data),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY })
      queryClient.setQueryData([...TEACHERS_QUERY_KEY, updatedTeacher.id], updatedTeacher)
    },
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teacherService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...TEACHERS_QUERY_KEY, deletedId] })
    },
  })
}
