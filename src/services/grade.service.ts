import { supabase } from '@/lib/supabase'
import type { LessonGrade, CreateLessonGrade, ClassGrade, CreateClassGrade, GradePeriod } from '@/types/entities'
import type { Database } from '@/types/database'

type LessonGradeRow = Database['public']['Tables']['lesson_grades']['Row']
type ClassGradeRow = Database['public']['Tables']['class_grades']['Row']

function transformLessonGradeRow(row: LessonGradeRow): LessonGrade {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    studentId: row.student_id,
    score: row.score,
    maxScore: row.max_score,
    gradeType: row.grade_type,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformClassGradeRow(row: ClassGradeRow): ClassGrade {
  return {
    id: row.id,
    classId: row.class_id,
    studentId: row.student_id,
    period: row.period,
    score: row.score,
    maxScore: row.max_score,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const gradeService = {
  // ─── Lesson Grades ─────────────────────────────────────────────────

  async getLessonGrades(lessonId: string): Promise<LessonGrade[]> {
    const { data, error } = await supabase
      .from('lesson_grades')
      .select('*')
      .eq('lesson_id', lessonId)
    if (error) throw error
    return data.map(transformLessonGradeRow)
  },

  async upsertLessonGrades(records: CreateLessonGrade[]): Promise<void> {
    const rows = records.map((r) => ({
      lesson_id: r.lessonId,
      student_id: r.studentId,
      score: r.score ?? null,
      max_score: r.maxScore,
      grade_type: r.gradeType,
      notes: r.notes ?? null,
    }))
    const { error } = await supabase
      .from('lesson_grades')
      .upsert(rows, { onConflict: 'lesson_id,student_id,grade_type' })
    if (error) throw error
  },

  // ─── Class Grades ──────────────────────────────────────────────────

  async getClassGrades(classId: string): Promise<ClassGrade[]> {
    const { data, error } = await supabase
      .from('class_grades')
      .select('*')
      .eq('class_id', classId)
    if (error) throw error
    return data.map(transformClassGradeRow)
  },

  async getClassGradesByPeriod(classId: string, period: GradePeriod): Promise<ClassGrade[]> {
    const { data, error } = await supabase
      .from('class_grades')
      .select('*')
      .eq('class_id', classId)
      .eq('period', period)
    if (error) throw error
    return data.map(transformClassGradeRow)
  },

  async upsertClassGrades(records: CreateClassGrade[]): Promise<void> {
    const rows = records.map((r) => ({
      class_id: r.classId,
      student_id: r.studentId,
      period: r.period,
      score: r.score ?? null,
      max_score: r.maxScore,
      notes: r.notes ?? null,
    }))
    const { error } = await supabase
      .from('class_grades')
      .upsert(rows, { onConflict: 'class_id,student_id,period' })
    if (error) throw error
  },

  async getStudentGrades(studentId: string): Promise<ClassGrade[]> {
    const { data, error } = await supabase
      .from('class_grades')
      .select('*')
      .eq('student_id', studentId)
    if (error) throw error
    return data.map(transformClassGradeRow)
  },
}
