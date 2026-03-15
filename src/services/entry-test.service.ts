import { supabase } from '@/lib/supabase'
import type {
  EntryTestCandidate,
  CreateEntryTestCandidate,
  UpdateEntryTestCandidate,
  EnglishLevel,
} from '@/types/entities'
import type { Database } from '@/types/database'

type EntryTestCandidateRow = Database['public']['Tables']['entry_test_candidate']['Row']
type EntryTestCandidateInsert = Database['public']['Tables']['entry_test_candidate']['Insert']
type EntryTestCandidateUpdate = Database['public']['Tables']['entry_test_candidate']['Update']

function transformDate(value: string | Date | undefined): string | null {
  if (!value) return null

  if (typeof value === 'string') {
    return value.trim() ? value : null
  }

  return value.toISOString()
}

function transformRow(row: EntryTestCandidateRow): EntryTestCandidate {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone,
    dateOfBirth: row.date_of_birth ?? undefined,
    testDate: row.test_date,
    entryResult: row.entry_result,
    recommendedLevel: (row.recommended_level ?? undefined) as EnglishLevel | undefined,
    decisionStatus: row.decision_status,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function transformCreate(data: CreateEntryTestCandidate): EntryTestCandidateInsert {
  return {
    name: data.name,
    email: data.email?.trim() ? data.email : null,
    phone: data.phone,
    date_of_birth: transformDate(data.dateOfBirth),
    test_date: typeof data.testDate === 'string' ? data.testDate : data.testDate.toISOString(),
    entry_result: data.entryResult,
    recommended_level: data.recommendedLevel ?? null,
    decision_status: data.decisionStatus,
    notes: data.notes ?? null,
  }
}

function transformUpdate(data: UpdateEntryTestCandidate): EntryTestCandidateUpdate {
  const update: EntryTestCandidateUpdate = {}

  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email?.trim() ? data.email : null
  if (data.phone !== undefined) update.phone = data.phone
  if (data.dateOfBirth !== undefined) update.date_of_birth = transformDate(data.dateOfBirth)
  if (data.testDate !== undefined) {
    update.test_date = typeof data.testDate === 'string' ? data.testDate : data.testDate.toISOString()
  }
  if (data.entryResult !== undefined) update.entry_result = data.entryResult
  if (data.recommendedLevel !== undefined) update.recommended_level = data.recommendedLevel ?? null
  if (data.decisionStatus !== undefined) update.decision_status = data.decisionStatus
  if (data.notes !== undefined) update.notes = data.notes ?? null

  return update
}

export const entryTestService = {
  async getAll(): Promise<EntryTestCandidate[]> {
    const { data, error } = await supabase
      .from('entry_test_candidate')
      .select('*')
      .order('test_date', { ascending: false })

    if (error) throw error
    return data.map(transformRow)
  },

  async getById(id: string): Promise<EntryTestCandidate> {
    const { data, error } = await supabase
      .from('entry_test_candidate')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformRow(data)
  },

  async create(candidate: CreateEntryTestCandidate): Promise<EntryTestCandidate> {
    const { data, error } = await supabase
      .from('entry_test_candidate')
      .insert(transformCreate(candidate))
      .select()
      .single()

    if (error) throw error
    return transformRow(data)
  },

  async update(id: string, updates: UpdateEntryTestCandidate): Promise<EntryTestCandidate> {
    const { data, error } = await supabase
      .from('entry_test_candidate')
      .update(transformUpdate(updates))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return transformRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('entry_test_candidate')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
