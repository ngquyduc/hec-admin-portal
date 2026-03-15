import { supabase } from '@/lib/supabase'
import type { Student, CreateStudent, UpdateStudent } from '@/types/entities'
import type { Database } from '@/types/database'

type StudentRow = Database['public']['Tables']['students']['Row']
type StudentInsert = Database['public']['Tables']['students']['Insert']
type StudentUpdate = Database['public']['Tables']['students']['Update']

function transformDate(value: string | Date | undefined): string | null {
  if (!value) return null

  if (typeof value === 'string') {
    return value.trim() ? value : null
  }

  return value.toISOString()
}

function transformStudentRow(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone,
    dateOfBirth: row.date_of_birth ?? undefined,
    enrollmentDate: row.enrollment_date,
    entryResult: row.entry_result ?? undefined,
    exitTarget: row.exit_target ?? undefined,
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
    email: data.email?.trim() ? data.email : null,
    phone: data.phone,
    date_of_birth: transformDate(data.dateOfBirth),
    enrollment_date: typeof data.enrollmentDate === 'string' ? data.enrollmentDate : data.enrollmentDate.toISOString(),
    entry_result: data.entryResult ?? null,
    exit_target: data.exitTarget ?? null,
    status: data.status,
    parent_id: data.parentId ?? null,
    address: data.address ?? null,
    notes: data.notes ?? null,
  }
}

function transformUpdateStudent(data: UpdateStudent): StudentUpdate {
  const update: StudentUpdate = {}
  
  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email?.trim() ? data.email : null
  if (data.phone !== undefined) update.phone = data.phone
  if (data.dateOfBirth !== undefined) {
    update.date_of_birth = transformDate(data.dateOfBirth)
  }
  if (data.enrollmentDate !== undefined) {
    update.enrollment_date = typeof data.enrollmentDate === 'string' ? data.enrollmentDate : data.enrollmentDate.toISOString()
  }
  if (data.entryResult !== undefined) update.entry_result = data.entryResult ?? null
  if (data.exitTarget !== undefined) update.exit_target = data.exitTarget ?? null
  if (data.status !== undefined) update.status = data.status
  if (data.parentId !== undefined) update.parent_id = data.parentId ?? null
  if (data.address !== undefined) update.address = data.address ?? null
  if (data.notes !== undefined) update.notes = data.notes ?? null
  
  return update
}

export const studentService = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
          .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getById(id: string): Promise<Student> {
    const { data, error } = await supabase
          .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async create(student: CreateStudent): Promise<Student> {
    const { data, error } = await supabase
          .from('students')
      .insert(transformCreateStudent(student))
      .select()
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async update(id: string, updates: UpdateStudent): Promise<Student> {
    const { data, error } = await supabase
          .from('students')
      .update(transformUpdateStudent(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformStudentRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
          .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string): Promise<Student[]> {
    const { data, error } = await supabase
          .from('students')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<Student[]> {
    const { data, error } = await supabase
          .from('students')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },

  async getByParent(parentId: string): Promise<Student[]> {
    const { data, error } = await supabase
          .from('students')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStudentRow)
  },
}
