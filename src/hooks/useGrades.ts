import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gradeService } from '@/services/grade.service'
import type { CreateLessonGrade, CreateClassGrade, GradePeriod } from '@/types/entities'

const LESSON_GRADES_KEY = ['lesson_grades'] as const
const CLASS_GRADES_KEY = ['class_grades'] as const

// ─── Lesson Grades ──────────────────────────────────────────────────

export function useLessonGrades(lessonId: string) {
  return useQuery({
    queryKey: [...LESSON_GRADES_KEY, lessonId],
    queryFn: () => gradeService.getLessonGrades(lessonId),
    enabled: !!lessonId,
  })
}

export function useUpsertLessonGrades() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (records: CreateLessonGrade[]) => gradeService.upsertLessonGrades(records),
    onSuccess: (_, records) => {
      const lessonId = records[0]?.lessonId
      if (lessonId) {
        queryClient.invalidateQueries({ queryKey: [...LESSON_GRADES_KEY, lessonId] })
      }
    },
  })
}

// ─── Class Grades ────────────────────────────────────────────────────

export function useClassGrades(classId: string) {
  return useQuery({
    queryKey: [...CLASS_GRADES_KEY, classId],
    queryFn: () => gradeService.getClassGrades(classId),
    enabled: !!classId,
  })
}

export function useClassGradesByPeriod(classId: string, period: GradePeriod) {
  return useQuery({
    queryKey: [...CLASS_GRADES_KEY, classId, period],
    queryFn: () => gradeService.getClassGradesByPeriod(classId, period),
    enabled: !!classId && !!period,
  })
}

export function useUpsertClassGrades() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (records: CreateClassGrade[]) => gradeService.upsertClassGrades(records),
    onSuccess: (_, records) => {
      const classId = records[0]?.classId
      if (classId) {
        queryClient.invalidateQueries({ queryKey: [...CLASS_GRADES_KEY, classId] })
      }
    },
  })
}

export function useStudentGrades(studentId: string) {
  return useQuery({
    queryKey: [...CLASS_GRADES_KEY, 'student', studentId],
    queryFn: () => gradeService.getStudentGrades(studentId),
    enabled: !!studentId,
  })
}
