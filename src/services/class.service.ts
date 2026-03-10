import { supabase } from '@/lib/supabase'
import type { Class, CreateClass, UpdateClass } from '@/types/entities'
import type { Database } from '@/types/database'

type ClassRow = Database['public']['Tables']['classes']['Row']
type ClassInsert = Database['public']['Tables']['classes']['Insert']
type ClassUpdate = Database['public']['Tables']['classes']['Update']

function transformClassRow(row: ClassRow): Class {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    teacherId: row.teacher_id,
    assistantId: row.assistant_id ?? undefined,
    level: row.level,
    status: row.status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreateClass(data: CreateClass): ClassInsert {
  return {
    name: data.name,
    description: data.description ?? null,
    teacher_id: data.teacherId,
    assistant_id: data.assistantId ?? null,
    level: data.level,
    status: data.status,
    notes: data.notes ?? null,
  }
}

function transformUpdateClass(data: UpdateClass): ClassUpdate {
  const update: ClassUpdate = {}
  if (data.name !== undefined) update.name = data.name
  if (data.description !== undefined) update.description = data.description ?? null
  if (data.teacherId !== undefined) update.teacher_id = data.teacherId
  if (data.assistantId !== undefined) update.assistant_id = data.assistantId ?? null
  if (data.level !== undefined) update.level = data.level
  if (data.status !== undefined) update.status = data.status
  if (data.notes !== undefined) update.notes = data.notes ?? null
  return update
}

export const classService = {
  async getAll(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(transformClassRow)
  },

  async getById(id: string): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return transformClassRow(data)
  },

  async create(classData: CreateClass): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .insert(transformCreateClass(classData))
      .select()
      .single()
    if (error) throw error
    return transformClassRow(data)
  },

  async update(id: string, updates: UpdateClass): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .update(transformUpdateClass(updates))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return transformClassRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (error) throw error
  },

  async search(query: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(transformClassRow)
  },

  async getByTeacher(teacherId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .or(`teacher_id.eq.${teacherId},assistant_id.eq.${teacherId}`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(transformClassRow)
  },

  async getStudents(classId: string): Promise<{ studentId: string; enrolledAt: string }[]> {
    const { data, error } = await supabase
      .from('class_students')
      .select('student_id, enrolled_at')
      .eq('class_id', classId)
    if (error) throw error
    return data.map((r) => ({ studentId: r.student_id, enrolledAt: r.enrolled_at }))
  },

  async addStudent(classId: string, studentId: string): Promise<void> {
    const { error } = await supabase
      .from('class_students')
      .insert({ class_id: classId, student_id: studentId })
    if (error) throw error
  },

  async removeStudent(classId: string, studentId: string): Promise<void> {
    const { error } = await supabase
      .from('class_students')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId)
    if (error) throw error
  },
}
