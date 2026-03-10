import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { classService } from '@/services/class.service'
import type { CreateClass, UpdateClass } from '@/types/entities'

const CLASSES_QUERY_KEY = ['classes'] as const

export function useClasses() {
  return useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: () => classService.getAll(),
  })
}

export function useClassById(id: string) {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, id],
    queryFn: () => classService.getById(id),
    enabled: !!id,
  })
}

export function useClassesByTeacher(teacherId: string) {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, 'teacher', teacherId],
    queryFn: () => classService.getByTeacher(teacherId),
    enabled: !!teacherId,
  })
}

export function useClassStudents(classId: string) {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, classId, 'students'],
    queryFn: () => classService.getStudents(classId),
    enabled: !!classId,
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateClass) => classService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY })
    },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClass }) =>
      classService.update(id, data),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY })
      queryClient.setQueryData([...CLASSES_QUERY_KEY, updatedClass.id], updatedClass)
    },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => classService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...CLASSES_QUERY_KEY, deletedId] })
    },
  })
}

export function useAddStudentToClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classService.addStudent(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: [...CLASSES_QUERY_KEY, classId, 'students'] })
    },
  })
}

export function useRemoveStudentFromClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      classService.removeStudent(classId, studentId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: [...CLASSES_QUERY_KEY, classId, 'students'] })
    },
  })
}
