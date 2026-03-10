import { supabase } from '@/lib/supabase'
import type { Parent, CreateParent, UpdateParent } from '@/types/entities'
import type { Database } from '@/types/database'

type ParentRow = Database['public']['Tables']['parent']['Row']
type ParentInsert = Database['public']['Tables']['parent']['Insert']
type ParentUpdate = Database['public']['Tables']['parent']['Update']

function transformParentRow(row: ParentRow): Parent {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    relationship: row.relationship,
    studentIds: row.student_ids,
    address: row.address ?? undefined,
    occupation: row.occupation ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreateParent(data: CreateParent): ParentInsert {
  return {
    name: data.name,
    email: data.email ?? null,
    phone: data.phone,
    relationship: data.relationship,
    student_ids: data.studentIds,
    address: data.address ?? null,
    occupation: data.occupation ?? null,
    notes: data.notes ?? null,
  }
}

function transformUpdateParent(data: UpdateParent): ParentUpdate {
  const update: ParentUpdate = {}
  
  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email
  if (data.phone !== undefined) update.phone = data.phone
  if (data.relationship !== undefined) update.relationship = data.relationship
  if (data.studentIds !== undefined) update.student_ids = data.studentIds
  if (data.address !== undefined) update.address = data.address ?? null
  if (data.occupation !== undefined) update.occupation = data.occupation ?? null
  if (data.notes !== undefined) update.notes = data.notes ?? null
  
  return update
}

export const parentService = {
  async getAll(): Promise<Parent[]> {
    const { data, error } = await supabase
      .from('parent')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformParentRow)
  },

  async getById(id: string): Promise<Parent> {
    const { data, error } = await supabase
      .from('parent')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformParentRow(data)
  },

  async create(parent: CreateParent): Promise<Parent> {
    const { data, error } = await supabase
      .from('parent')
      .insert(transformCreateParent(parent))
      .select()
      .single()

    if (error) throw error
    return transformParentRow(data)
  },

  async update(id: string, updates: UpdateParent): Promise<Parent> {
    const { data, error } = await supabase
      .from('parent')
      .update(transformUpdateParent(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformParentRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('parent')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string): Promise<Parent[]> {
    const { data, error } = await supabase
      .from('parent')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformParentRow)
  },

  async addStudent(parentId: string, studentId: string): Promise<Parent> {
    const parent = await this.getById(parentId)
    const updatedStudentIds = [...new Set([...parent.studentIds, studentId])]
    
    return this.update(parentId, { studentIds: updatedStudentIds })
  },

  async removeStudent(parentId: string, studentId: string): Promise<Parent> {
    const parent = await this.getById(parentId)
    const updatedStudentIds = parent.studentIds.filter(id => id !== studentId)
    
    return this.update(parentId, { studentIds: updatedStudentIds })
  },
}
