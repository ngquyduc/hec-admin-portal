import { supabase } from '@/lib/supabase'
import type { Class, CreateClass, UpdateClass } from '@/types/entities'
import type { Database } from '@/types/database'

type ClassRow = Database['public']['Tables']['classes']['Row']
type ClassInsert = Database['public']['Tables']['classes']['Insert']
type ClassUpdate = Database['public']['Tables']['classes']['Update']
type ClassTeacherAssignmentInsert = Database['public']['Tables']['class_teacher_assignments']['Insert']

type ClassAssignmentMap = Map<
  string,
  {
    mainTeacherIds: string[]
    teachingAssistantIds: string[]
  }
>

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))]
}

function assertNoRoleOverlap(mainTeacherIds: string[], teachingAssistantIds: string[]) {
  const assistantSet = new Set(teachingAssistantIds)
  const hasOverlap = mainTeacherIds.some((teacherId) => assistantSet.has(teacherId))
  if (hasOverlap) {
    throw new Error('A teacher cannot be both main teacher and teaching assistant in the same class.')
  }
}

function transformClassRow(
  row: ClassRow,
  assignment?: { mainTeacherIds: string[]; teachingAssistantIds: string[] },
): Class {
  const mainTeacherIds = uniqueIds(assignment?.mainTeacherIds ?? [])
  const teachingAssistantIds = uniqueIds(assignment?.teachingAssistantIds ?? [])

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    mainTeacherIds,
    teachingAssistantIds,
    classType: row.class_type,
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
    class_type: data.classType,
    level: data.level,
    status: data.status,
    notes: data.notes ?? null,
  }
}

function transformUpdateClass(data: UpdateClass): ClassUpdate {
  const update: ClassUpdate = {}
  if (data.name !== undefined) update.name = data.name
  if (data.description !== undefined) update.description = data.description ?? null
  if (data.classType !== undefined) update.class_type = data.classType
  if (data.level !== undefined) update.level = data.level
  if (data.status !== undefined) update.status = data.status
  if (data.notes !== undefined) update.notes = data.notes ?? null
  return update
}

function toAssignmentRows(
  classId: string,
  mainTeacherIds: string[],
  teachingAssistantIds: string[],
): ClassTeacherAssignmentInsert[] {
  const mainRows: ClassTeacherAssignmentInsert[] = mainTeacherIds.map((teacherId) => ({
    class_id: classId,
    teacher_id: teacherId,
    role: 'main-teacher',
  }))

  const assistantRows: ClassTeacherAssignmentInsert[] = teachingAssistantIds.map((teacherId) => ({
    class_id: classId,
    teacher_id: teacherId,
    role: 'teaching-assistant',
  }))

  return [...mainRows, ...assistantRows]
}

async function getAssignmentMap(classIds: string[]): Promise<ClassAssignmentMap> {
  const map: ClassAssignmentMap = new Map()

  if (classIds.length === 0) {
    return map
  }

  const { data, error } = await supabase
    .from('class_teacher_assignments')
    .select('class_id, teacher_id, role')
    .in('class_id', classIds)

  if (error) throw error

  for (const row of data) {
    const existing = map.get(row.class_id) ?? { mainTeacherIds: [], teachingAssistantIds: [] }
    if (row.role === 'main-teacher') {
      existing.mainTeacherIds.push(row.teacher_id)
    } else {
      existing.teachingAssistantIds.push(row.teacher_id)
    }
    map.set(row.class_id, existing)
  }

  return map
}

async function replaceAssignments(
  classId: string,
  mainTeacherIds: string[],
  teachingAssistantIds: string[],
): Promise<void> {
  const normalizedMainIds = uniqueIds(mainTeacherIds)
  const normalizedAssistantIds = uniqueIds(teachingAssistantIds)

  if (normalizedMainIds.length === 0) {
    throw new Error('At least one main teacher is required.')
  }

  if (normalizedAssistantIds.length === 0) {
    throw new Error('At least one teaching assistant is required.')
  }

  assertNoRoleOverlap(normalizedMainIds, normalizedAssistantIds)

  const { error: deleteError } = await supabase
    .from('class_teacher_assignments')
    .delete()
    .eq('class_id', classId)

  if (deleteError) throw deleteError

  const rows = toAssignmentRows(classId, normalizedMainIds, normalizedAssistantIds)
  const { error: insertError } = await supabase.from('class_teacher_assignments').insert(rows)
  if (insertError) throw insertError
}

export const classService = {
  async getAll(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error

    const assignments = await getAssignmentMap(data.map((row) => row.id))
    return data.map((row) => transformClassRow(row, assignments.get(row.id)))
  },

  async getById(id: string): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error

    const assignments = await getAssignmentMap([id])
    return transformClassRow(data, assignments.get(id))
  },

  async create(classData: CreateClass): Promise<Class> {
    const mainTeacherIds = uniqueIds(classData.mainTeacherIds)
    const teachingAssistantIds = uniqueIds(classData.teachingAssistantIds)
    assertNoRoleOverlap(mainTeacherIds, teachingAssistantIds)

    const { data, error } = await supabase
      .from('classes')
      .insert(transformCreateClass({ ...classData, mainTeacherIds, teachingAssistantIds }))
      .select()
      .single()
    if (error) throw error

    await replaceAssignments(data.id, mainTeacherIds, teachingAssistantIds)
    return this.getById(data.id)
  },

  async update(id: string, updates: UpdateClass): Promise<Class> {
    const shouldUpdateAssignments =
      updates.mainTeacherIds !== undefined || updates.teachingAssistantIds !== undefined

    let resolvedMainTeacherIds = updates.mainTeacherIds
    let resolvedTeachingAssistantIds = updates.teachingAssistantIds

    if (shouldUpdateAssignments) {
      const currentClass = await this.getById(id)
      resolvedMainTeacherIds = updates.mainTeacherIds ?? currentClass.mainTeacherIds
      resolvedTeachingAssistantIds =
        updates.teachingAssistantIds ?? currentClass.teachingAssistantIds
      assertNoRoleOverlap(resolvedMainTeacherIds, resolvedTeachingAssistantIds)
    }

    const { data, error } = await supabase
      .from('classes')
      .update(
        transformUpdateClass({
          ...updates,
          mainTeacherIds: resolvedMainTeacherIds,
          teachingAssistantIds: resolvedTeachingAssistantIds,
        }),
      )
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    if (shouldUpdateAssignments && resolvedMainTeacherIds && resolvedTeachingAssistantIds) {
      await replaceAssignments(id, resolvedMainTeacherIds, resolvedTeachingAssistantIds)
    }

    const assignments = await getAssignmentMap([id])
    return transformClassRow(data, assignments.get(id))
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

    const assignments = await getAssignmentMap(data.map((row) => row.id))
    return data.map((row) => transformClassRow(row, assignments.get(row.id)))
  },

  async getByTeacher(teacherId: string): Promise<Class[]> {
    const { data: assignmentRows, error: assignmentError } = await supabase
      .from('class_teacher_assignments')
      .select('class_id')
      .eq('teacher_id', teacherId)

    if (assignmentError) throw assignmentError

    const classIds = [...new Set(assignmentRows.map((row) => row.class_id))]

    if (classIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .in('id', classIds)
      .order('created_at', { ascending: false })

    if (error) throw error

    const assignments = await getAssignmentMap(data.map((row) => row.id))
    return data.map((row) => transformClassRow(row, assignments.get(row.id)))
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
