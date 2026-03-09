import { supabase } from '@/lib/supabase'
import type { Teacher, CreateTeacher, UpdateTeacher } from '@/types/entities'
import type { Database } from '@/types/database'

type TeacherRow = Database['public']['Tables']['teacher']['Row']
type TeacherInsert = Database['public']['Tables']['teacher']['Insert']
type TeacherUpdate = Database['public']['Tables']['teacher']['Update']

function transformTeacherRow(row: TeacherRow): Teacher {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subjects: row.subjects,
    qualifications: row.qualifications,
    hireDate: row.hire_date,
    status: row.status,
    hourlyRate: row.hourly_rate ?? undefined,
    address: row.address ?? undefined,
    emergencyContact: row.emergency_contact ?? undefined,
    bio: row.bio ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreateTeacher(data: CreateTeacher): TeacherInsert {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subjects: data.subjects,
    qualifications: data.qualifications,
    hire_date: typeof data.hireDate === 'string' ? data.hireDate : data.hireDate.toISOString(),
    status: data.status,
    hourly_rate: data.hourlyRate ?? null,
    address: data.address ?? null,
    emergency_contact: data.emergencyContact ?? null,
    bio: data.bio ?? null,
    notes: data.notes ?? null,
  }
}

function transformUpdateTeacher(data: UpdateTeacher): TeacherUpdate {
  const update: TeacherUpdate = {}
  
  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email
  if (data.phone !== undefined) update.phone = data.phone
  if (data.subjects !== undefined) update.subjects = data.subjects
  if (data.qualifications !== undefined) update.qualifications = data.qualifications
  if (data.hireDate !== undefined) {
    update.hire_date = typeof data.hireDate === 'string' ? data.hireDate : data.hireDate.toISOString()
  }
  if (data.status !== undefined) update.status = data.status
  if (data.hourlyRate !== undefined) update.hourly_rate = data.hourlyRate ?? null
  if (data.address !== undefined) update.address = data.address ?? null
  if (data.emergencyContact !== undefined) update.emergency_contact = data.emergencyContact ?? null
  if (data.bio !== undefined) update.bio = data.bio ?? null
  if (data.notes !== undefined) update.notes = data.notes ?? null
  
  return update
}

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformTeacherRow)
  },

  async getById(id: string): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformTeacherRow(data)
  },

  async create(teacher: CreateTeacher): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teacher')
      .insert(transformCreateTeacher(teacher))
      .select()
      .single()

    if (error) throw error
    return transformTeacherRow(data)
  },

  async update(id: string, updates: UpdateTeacher): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teacher')
      .update(transformUpdateTeacher(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformTeacherRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('teacher')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformTeacherRow)
  },

  async getByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformTeacherRow)
  },

  async getBySubject(subject: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .contains('subjects', [subject])
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformTeacherRow)
  },
}
