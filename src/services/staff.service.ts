import { supabase } from '@/lib/supabase'
import type { Staff, CreateStaff, UpdateStaff } from '@/types/entities'
import type { Database } from '@/types/database'

type StaffRow = Database['public']['Tables']['staff']['Row']
type StaffInsert = Database['public']['Tables']['staff']['Insert']
type StaffUpdate = Database['public']['Tables']['staff']['Update']

// Transform database row to entity
function transformStaffRow(row: StaffRow): Staff {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    hireDate: row.hire_date,
    status: row.status,
    address: row.address ?? undefined,
    emergencyContact: row.emergency_contact ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Transform create input to database insert
function transformCreateStaff(data: CreateStaff): StaffInsert {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    role: data.role,
    hire_date: typeof data.hireDate === 'string' ? data.hireDate : data.hireDate.toISOString(),
    status: data.status,
    address: data.address ?? null,
    emergency_contact: data.emergencyContact ?? null,
    notes: data.notes ?? null,
  }
}

// Transform update input to database update
function transformUpdateStaff(data: UpdateStaff): StaffUpdate {
  const update: StaffUpdate = {}
  
  if (data.firstName !== undefined) update.first_name = data.firstName
  if (data.lastName !== undefined) update.last_name = data.lastName
  if (data.email !== undefined) update.email = data.email
  if (data.phone !== undefined) update.phone = data.phone
  if (data.role !== undefined) update.role = data.role
  if (data.hireDate !== undefined) {
    update.hire_date = typeof data.hireDate === 'string' ? data.hireDate : data.hireDate.toISOString()
  }
  if (data.status !== undefined) update.status = data.status
  if (data.address !== undefined) update.address = data.address ?? null
  if (data.emergencyContact !== undefined) update.emergency_contact = data.emergencyContact ?? null
  if (data.notes !== undefined) update.notes = data.notes ?? null
  
  return update
}

export const staffService = {
  async getAll(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStaffRow)
  },

  async getById(id: string): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformStaffRow(data)
  },

  async create(staff: CreateStaff): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .insert(transformCreateStaff(staff))
      .select()
      .single()

    if (error) throw error
    return transformStaffRow(data)
  },

  async update(id: string, updates: UpdateStaff): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(transformUpdateStaff(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformStaffRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async search(query: string): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStaffRow)
  },

  async getByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformStaffRow)
  },
}
