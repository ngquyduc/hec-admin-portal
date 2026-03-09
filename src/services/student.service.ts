import { supabase } from '@/lib/supabase'
import type { Student, CreateStudent, UpdateStudent } from '@/types/entities'
import type { Database } from '@/types/database'

type StudentRow = Database['public']['Tables']['student']['Row']
type StudentInsert = Database['public']['Tables']['student']['Insert']
type StudentUpdate = Database['public']['Tables']['student']['Update']

function transformStudentRow(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    dateOfBirth: row.date_of_birth,
    enrollmentDate: row.enrollment_date,
    level: row.level,
    status: row.status,
    parentId: row.parent_id ?? undefined,
    address: row.address ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreateStudent(data: CreateStudent): StudentInsert {
  return {
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    date_of_birth: typeof data.dateOfBirth === 'string' ? data.dateOfBirth : data.dateOfBirth.toISOString(),
    enrollment_date: typeof data.enrollmentDate === 'string' ? data.enrollmentDate : data.enrollmentDate.toISOString(),
    level: data.level,
    status: data.status,
    parent_id: data.parentId ?? null,
    address: data.address ?? null,
    notes: data.notes ?? null,
  }
}

function transformUpdateStudent(data: UpdateStudent): StudentUpdate {
  const update: StudentUpdate = {}
  
  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email ?? null
  if (data.phone !== undefined) update.phone = data.phone ?? null
  if (data.dateOfBirth !== undefined) {
    update.date_of_birth = typeof data.dateOfBirth === 'string' ? data.dateOfBirth : data.dateOfBirth.toISOString()
  }
  if (data.enrollmentDate !== undefined) {
    update.enrollment_date = typeof data.enrollmentDate === 'string' ? data.enrollmentDate : data.enrollmentDate.toISOString()
  }
  if (data.level !== undefined) update.level = data.level
  if (data.status !== undefined) update.status = data.status
  if (data.parentId !== undefined) update.parent_id = data.parentId ?? null
  if (data.address !== undefined) update.address = data.address ?? null
  if (data.notes !== undefined) update.notes = data.notes ?? null
  
  return update
}

export const studentService = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getById(id: string): Promise<Student> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async create(student: CreateStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('student')
      .insert(transformCreateStudent(student))
      .select()
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async update(id: string, updates: UpdateStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('student')
      .update(transformUpdateStudent(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('student')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getByLevel(level: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('level', level)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getByParent(parentId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },
}
