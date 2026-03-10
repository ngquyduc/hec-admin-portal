import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonService } from '@/services/lesson.service'
import type { CreateLesson, UpdateLesson, CreateAttendance } from '@/types/entities'

const LESSONS_QUERY_KEY = ['lessons'] as const

export function useLessons() {
  return useQuery({
    queryKey: LESSONS_QUERY_KEY,
    queryFn: () => lessonService.getAll(),
  })
}

export function useLessonById(id: string) {
  return useQuery({
    queryKey: [...LESSONS_QUERY_KEY, id],
    queryFn: () => lessonService.getById(id),
    enabled: !!id,
  })
}

export function useLessonsByClass(classId: string) {
  return useQuery({
    queryKey: [...LESSONS_QUERY_KEY, 'class', classId],
    queryFn: () => lessonService.getByClass(classId),
    enabled: !!classId,
  })
}

export function useLessonAttendance(lessonId: string) {
  return useQuery({
    queryKey: [...LESSONS_QUERY_KEY, lessonId, 'attendance'],
    queryFn: () => lessonService.getAttendance(lessonId),
    enabled: !!lessonId,
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLesson) => lessonService.create(data),
    onSuccess: (lesson) => {
      queryClient.invalidateQueries({ queryKey: LESSONS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...LESSONS_QUERY_KEY, 'class', lesson.classId],
      })
    },
  })
}

export function useUpdateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLesson }) =>
      lessonService.update(id, data),
    onSuccess: (updatedLesson) => {
      queryClient.invalidateQueries({ queryKey: LESSONS_QUERY_KEY })
      queryClient.setQueryData([...LESSONS_QUERY_KEY, updatedLesson.id], updatedLesson)
    },
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lessonService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: LESSONS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: [...LESSONS_QUERY_KEY, deletedId] })
    },
  })
}

export function useUpsertAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (records: CreateAttendance[]) => lessonService.upsertAttendance(records),
    onSuccess: (_, records) => {
      const lessonId = records[0]?.lessonId
      if (lessonId) {
        queryClient.invalidateQueries({
          queryKey: [...LESSONS_QUERY_KEY, lessonId, 'attendance'],
        })
      }
    },
  })
}
