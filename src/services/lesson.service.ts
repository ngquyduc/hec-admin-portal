import { supabase } from '@/lib/supabase'
import type { Lesson, CreateLesson, UpdateLesson, Attendance, CreateAttendance } from '@/types/entities'
import type { Database } from '@/types/database'

type LessonRow = Database['public']['Tables']['lessons']['Row']
type LessonInsert = Database['public']['Tables']['lessons']['Insert']
type LessonUpdate = Database['public']['Tables']['lessons']['Update']
type AttendanceRow = Database['public']['Tables']['lesson_attendance']['Row']

function transformLessonRow(row: LessonRow): Lesson {
  return {
    id: row.id,
    classId: row.class_id,
    title: row.title,
    content: row.content ?? undefined,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformAttendanceRow(row: AttendanceRow): Attendance {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    studentId: row.student_id,
    status: row.status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreateLesson(data: CreateLesson): LessonInsert {
  return {
    class_id: data.classId,
    title: data.title,
    content: data.content ?? null,
    start_time: data.startTime,
    end_time: data.endTime,
    status: data.status,
    notes: data.notes ?? null,
  }
}

function transformUpdateLesson(data: UpdateLesson): LessonUpdate {
  const update: LessonUpdate = {}
  if (data.classId !== undefined) update.class_id = data.classId
  if (data.title !== undefined) update.title = data.title
  if (data.content !== undefined) update.content = data.content ?? null
  if (data.startTime !== undefined) update.start_time = data.startTime
  if (data.endTime !== undefined) update.end_time = data.endTime
  if (data.status !== undefined) update.status = data.status
  if (data.notes !== undefined) update.notes = data.notes ?? null
  return update
}

export const lessonService = {
  async getAll(): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('start_time', { ascending: false })
    if (error) throw error
    return data.map(transformLessonRow)
  },

  async getById(id: string): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return transformLessonRow(data)
  },

  async getByClass(classId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('class_id', classId)
      .order('start_time', { ascending: true })
    if (error) throw error
    return data.map(transformLessonRow)
  },

  async create(lessonData: CreateLesson): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .insert(transformCreateLesson(lessonData))
      .select()
      .single()
    if (error) throw error
    return transformLessonRow(data)
  },

  async update(id: string, updates: UpdateLesson): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .update(transformUpdateLesson(updates))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return transformLessonRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) throw error
  },

  async getAttendance(lessonId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('lesson_attendance')
      .select('*')
      .eq('lesson_id', lessonId)
    if (error) throw error
    return data.map(transformAttendanceRow)
  },

  async upsertAttendance(records: CreateAttendance[]): Promise<void> {
    const rows = records.map((r) => ({
      lesson_id: r.lessonId,
      student_id: r.studentId,
      status: r.status,
      notes: r.notes ?? null,
    }))
    const { error } = await supabase
      .from('lesson_attendance')
      .upsert(rows, { onConflict: 'lesson_id,student_id' })
    if (error) throw error
  },
}
