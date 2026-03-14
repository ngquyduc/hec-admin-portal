import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentService } from '@/services/student.service'
import type { CreateStudent, UpdateStudent } from '@/types/entities'

const STUDENTS_QUERY_KEY = ['students'] as const

export function useStudents() {
  return useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: () => studentService.getAll(),
  })
}

export function useStudentById(id: string) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  })
}

export function useStudentsByStatus(status: 'active' | 'inactive' | 'suspended') {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, 'status', status],
    queryFn: () => studentService.getByStatus(status),
  })
}

export function useStudentsByParent(parentId: string) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, 'parent', parentId],
    queryFn: () => studentService.getByParent(parentId),
    enabled: !!parentId,
  })
}

export function useStudentsSearch(query: string) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, 'search', query],
    queryFn: () => studentService.search(query),
    enabled: query.length > 0,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStudent) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudent }) =>
      studentService.update(id, data),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY })
      queryClient.setQueryData([...STUDENTS_QUERY_KEY, updatedStudent.id], updatedStudent)
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...STUDENTS_QUERY_KEY, deletedId] })
    },
  })
}
