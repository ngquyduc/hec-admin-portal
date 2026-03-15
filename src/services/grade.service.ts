import { supabase } from '@/lib/supabase'
import type { Assessment, AssessmentType, AssessmentScoreRecord } from '@/types/entities'
import type { Database } from '@/types/database'

type AssessmentRow = Database['public']['Tables']['assessments']['Row']
type AssessmentScoreRow = Database['public']['Tables']['assessment_scores']['Row']

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
}

type UpsertAssessmentScoresByIdInput = {
  assessmentId: string
  records: {
    studentId: string
    score: number | null
    feedback?: string
  }[]
}

function mapRecord(
  assessment: AssessmentRow,
  scoreRow: AssessmentScoreRow,
): AssessmentScoreRecord {
  return {
    assessmentId: assessment.id,
    classId: assessment.class_id,
    lessonId: assessment.lesson_id ?? undefined,
    type: assessment.type,
    title: assessment.title,
    maxScore: Number(assessment.max_score),
    weight: Number(assessment.weight),
    studentId: scoreRow.student_id,
    score: scoreRow.score,
    feedback: scoreRow.feedback ?? undefined,
  }
}

function mapAssessment(assessment: AssessmentRow): Assessment {
  return {
    id: assessment.id,
    classId: assessment.class_id,
    lessonId: assessment.lesson_id ?? undefined,
    type: assessment.type,
    title: assessment.title,
    maxScore: Number(assessment.max_score),
    weight: Number(assessment.weight),
    assignedAt: assessment.assigned_at,
    dueAt: assessment.due_at ?? undefined,
    notes: assessment.notes ?? undefined,
    createdAt: assessment.created_at,
    updatedAt: assessment.updated_at,
  }
}

export const gradeService = {
  async createAssessment(payload: CreateAssessmentInput): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        class_id: payload.classId,
        lesson_id: payload.lessonId ?? null,
        type: payload.type,
        title: payload.title,
        max_score: payload.maxScore,
        weight: payload.weight ?? 1,
        due_at: payload.dueAt ?? null,
        notes: payload.notes ?? null,
      })
      .select('*')
      .single()

    if (error) throw error
    return mapAssessment(data)
  },

  async getClassAssessments(classId: string): Promise<Assessment[]> {
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .order('assigned_at', { ascending: false })
    if (assessmentError) throw assessmentError

    return assessments.map(mapAssessment)
  },

  async getAssessmentById(assessmentId: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()
    if (error) throw error

    return mapAssessment(data)
  },

  async getAssessmentScores(assessmentId: string): Promise<AssessmentScoreRecord[]> {
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()
    if (assessmentError) throw assessmentError

    const { data: scoreRows, error: scoreError } = await supabase
      .from('assessment_scores')
      .select('*')
      .eq('assessment_id', assessmentId)
    if (scoreError) throw scoreError

    return scoreRows.map((scoreRow) => mapRecord(assessment, scoreRow))
  },

  async getLessonAssessmentScores(classId: string, lessonId: string): Promise<AssessmentScoreRecord[]> {
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .eq('lesson_id', lessonId)
    if (assessmentError) throw assessmentError

    if (assessments.length === 0) return []

    const assessmentById = new Map(assessments.map((assessment) => [assessment.id, assessment]))
    const assessmentIds = assessments.map((assessment) => assessment.id)

    const { data: scoreRows, error: scoreError } = await supabase
      .from('assessment_scores')
      .select('*')
      .in('assessment_id', assessmentIds)
    if (scoreError) throw scoreError

    return scoreRows
      .map((scoreRow) => {
        const assessment = assessmentById.get(scoreRow.assessment_id)
        if (!assessment) return null
        return mapRecord(assessment, scoreRow)
      })
      .filter((record): record is AssessmentScoreRecord => record !== null)
  },

  async getClassAssessmentScores(classId: string): Promise<AssessmentScoreRecord[]> {
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .is('lesson_id', null)
    if (assessmentError) throw assessmentError

    if (assessments.length === 0) return []

    const assessmentById = new Map(assessments.map((assessment) => [assessment.id, assessment]))
    const assessmentIds = assessments.map((assessment) => assessment.id)

    const { data: scoreRows, error: scoreError } = await supabase
      .from('assessment_scores')
      .select('*')
      .in('assessment_id', assessmentIds)
    if (scoreError) throw scoreError

    return scoreRows
      .map((scoreRow) => {
        const assessment = assessmentById.get(scoreRow.assessment_id)
        if (!assessment) return null
        return mapRecord(assessment, scoreRow)
      })
      .filter((record): record is AssessmentScoreRecord => record !== null)
  },

  async getStudentAssessmentScores(studentId: string): Promise<AssessmentScoreRecord[]> {
    const { data: scoreRows, error: scoreError } = await supabase
      .from('assessment_scores')
      .select('*')
      .eq('student_id', studentId)
    if (scoreError) throw scoreError

    if (scoreRows.length === 0) return []

    const assessmentIds = scoreRows.map((row) => row.assessment_id)
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .in('id', assessmentIds)
    if (assessmentError) throw assessmentError

    const assessmentById = new Map(assessments.map((assessment) => [assessment.id, assessment]))

    return scoreRows
      .map((scoreRow) => {
        const assessment = assessmentById.get(scoreRow.assessment_id)
        if (!assessment) return null
        return mapRecord(assessment, scoreRow)
      })
      .filter((record): record is AssessmentScoreRecord => record !== null)
  },

  async upsertAssessmentScores(payload: UpsertAssessmentScoresInput): Promise<void> {
    const { classId, lessonId, type, title, maxScore, records } = payload

    let assessmentQuery = supabase
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .eq('type', type)

    assessmentQuery = lessonId
      ? assessmentQuery.eq('lesson_id', lessonId)
      : assessmentQuery.is('lesson_id', null)

    const { data: existingAssessment, error: findError } = await assessmentQuery
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (findError) throw findError

    let assessmentId = existingAssessment?.id

    if (!assessmentId) {
      const { data: createdAssessment, error: createError } = await supabase
        .from('assessments')
        .insert({
          class_id: classId,
          lesson_id: lessonId ?? null,
          type,
          title,
          max_score: maxScore,
        })
        .select('*')
        .single()
      if (createError) throw createError
      assessmentId = createdAssessment.id
    } else {
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          title,
          max_score: maxScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assessmentId)
      if (updateError) throw updateError
    }

    const scoreRows = records.map((record) => ({
      assessment_id: assessmentId,
      student_id: record.studentId,
      score: record.score,
      feedback: record.feedback ?? null,
    }))

    const { error: upsertError } = await supabase
      .from('assessment_scores')
      .upsert(scoreRows, { onConflict: 'assessment_id,student_id' })
    if (upsertError) throw upsertError
  },

  async upsertAssessmentScoresById(payload: UpsertAssessmentScoresByIdInput): Promise<void> {
    const rows = payload.records.map((record) => ({
      assessment_id: payload.assessmentId,
      student_id: record.studentId,
      score: record.score,
      feedback: record.feedback ?? null,
    }))

    const { error } = await supabase
      .from('assessment_scores')
      .upsert(rows, { onConflict: 'assessment_id,student_id' })

    if (error) throw error
  },
}
