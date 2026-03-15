import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gradeService } from '@/services/grade.service'
import type { AssessmentType } from '@/types/entities'

const LESSON_ASSESSMENT_SCORES_KEY = ['lesson_assessment_scores'] as const
const CLASS_ASSESSMENT_SCORES_KEY = ['class_assessment_scores'] as const
const CLASS_ASSESSMENTS_KEY = ['class_assessments'] as const
const ASSESSMENT_KEY = ['assessment'] as const
const ASSESSMENT_SCORES_KEY = ['assessment_scores'] as const
const ASSESSMENT_COMPONENTS_KEY = ['assessment_components'] as const
const ASSESSMENT_COMPONENT_SCORES_KEY = ['assessment_component_scores'] as const
const CLASS_GRADEBOOK_KEY = ['class_gradebook'] as const

type UpsertAssessmentScoresInput = {
  classId: string
  lessonId?: string
  type: AssessmentType
  title: string
  maxScore: number
  records: {
    studentId: string
    score: number | null
    feedback?: string
  }[]
}

type CreateAssessmentInput = {
  classId: string
  lessonId?: string
  type: AssessmentType
  title: string
  maxScore: number
  weight?: number
  dueAt?: string
  notes?: string
  components?: {
    title: string
    isScorable: boolean
    maxScore?: number
    notes?: string
  }[]
}

type UpsertAssessmentScoresByIdInput = {
  assessmentId: string
  records: {
    studentId: string
    score: number | null
    feedback?: string
  }[]
}

type UpsertAssessmentComponentScoresByAssessmentInput = {
  assessmentId: string
  records: {
    componentId: string
    studentId: string
    score: number | null
    feedback?: string
  }[]
}

export function useLessonAssessmentScores(classId: string, lessonId: string) {
  return useQuery({
    queryKey: [...LESSON_ASSESSMENT_SCORES_KEY, classId, lessonId],
    queryFn: () => gradeService.getLessonAssessmentScores(classId, lessonId),
    enabled: !!lessonId && !!classId,
  })
}

export function useUpsertLessonAssessmentScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertAssessmentScoresInput) =>
      gradeService.upsertAssessmentScores(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...CLASS_ASSESSMENTS_KEY, payload.classId] })
      if (payload.lessonId) {
        queryClient.invalidateQueries({
          queryKey: [...LESSON_ASSESSMENT_SCORES_KEY, payload.classId, payload.lessonId],
        })
      }
    },
  })
}

export function useClassAssessmentScores(classId: string) {
  return useQuery({
    queryKey: [...CLASS_ASSESSMENT_SCORES_KEY, classId],
    queryFn: () => gradeService.getClassAssessmentScores(classId),
    enabled: !!classId,
  })
}

export function useClassAssessments(classId: string) {
  return useQuery({
    queryKey: [...CLASS_ASSESSMENTS_KEY, classId],
    queryFn: () => gradeService.getClassAssessments(classId),
    enabled: !!classId,
  })
}

export function useClassGradebook(classId: string) {
  return useQuery({
    queryKey: [...CLASS_GRADEBOOK_KEY, classId],
    queryFn: () => gradeService.getClassGradebook(classId),
    enabled: !!classId,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAssessmentInput) => gradeService.createAssessment(payload),
    onSuccess: (assessment) => {
      queryClient.invalidateQueries({ queryKey: [...CLASS_ASSESSMENTS_KEY, assessment.classId] })
    },
  })
}

export function useAssessmentById(assessmentId: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_KEY, assessmentId],
    queryFn: () => gradeService.getAssessmentById(assessmentId),
    enabled: !!assessmentId,
  })
}

export function useAssessmentScores(assessmentId: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_SCORES_KEY, assessmentId],
    queryFn: () => gradeService.getAssessmentScores(assessmentId),
    enabled: !!assessmentId,
  })
}

export function useAssessmentComponents(assessmentId: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_COMPONENTS_KEY, assessmentId],
    queryFn: () => gradeService.getAssessmentComponents(assessmentId),
    enabled: !!assessmentId,
  })
}

export function useAssessmentComponentScores(assessmentId: string) {
  return useQuery({
    queryKey: [...ASSESSMENT_COMPONENT_SCORES_KEY, assessmentId],
    queryFn: () => gradeService.getAssessmentComponentScores(assessmentId),
    enabled: !!assessmentId,
  })
}

export function useUpsertAssessmentScoresById() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpsertAssessmentScoresByIdInput) =>
      gradeService.upsertAssessmentScoresById(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENT_SCORES_KEY, payload.assessmentId] })
      queryClient.invalidateQueries({ queryKey: CLASS_ASSESSMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CLASS_GRADEBOOK_KEY })
      queryClient.invalidateQueries({ queryKey: CLASS_ASSESSMENT_SCORES_KEY })
      queryClient.invalidateQueries({ queryKey: LESSON_ASSESSMENT_SCORES_KEY })
    },
  })
}

export function useUpsertAssessmentComponentScoresByAssessmentId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpsertAssessmentComponentScoresByAssessmentInput) =>
      gradeService.upsertAssessmentComponentScoresByAssessmentId(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENT_COMPONENT_SCORES_KEY, payload.assessmentId] })
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENT_SCORES_KEY, payload.assessmentId] })
      queryClient.invalidateQueries({ queryKey: CLASS_ASSESSMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: CLASS_GRADEBOOK_KEY })
      queryClient.invalidateQueries({ queryKey: CLASS_ASSESSMENT_SCORES_KEY })
      queryClient.invalidateQueries({ queryKey: LESSON_ASSESSMENT_SCORES_KEY })
    },
  })
}

export function useUpsertClassAssessmentScores() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertAssessmentScoresInput) =>
      gradeService.upsertAssessmentScores(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...CLASS_ASSESSMENT_SCORES_KEY, payload.classId] })
      queryClient.invalidateQueries({ queryKey: [...CLASS_ASSESSMENTS_KEY, payload.classId] })
      queryClient.invalidateQueries({ queryKey: [...CLASS_GRADEBOOK_KEY, payload.classId] })
      if (payload.lessonId) {
        queryClient.invalidateQueries({
          queryKey: [...LESSON_ASSESSMENT_SCORES_KEY, payload.classId, payload.lessonId],
        })
      }
    },
  })
}

export function useStudentAssessmentScores(studentId: string) {
  return useQuery({
    queryKey: [...CLASS_ASSESSMENT_SCORES_KEY, 'student', studentId],
    queryFn: () => gradeService.getStudentAssessmentScores(studentId),
    enabled: !!studentId,
  })
}
