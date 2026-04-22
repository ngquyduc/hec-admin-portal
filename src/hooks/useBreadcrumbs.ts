import { useMatches } from '@tanstack/react-router'
import { useClassById } from '@/hooks/useClasses'
import { useLessonById } from '@/hooks/useLessons'
import { useStaffById } from '@/hooks/useStaff'
import { useTeacherById } from '@/hooks/useTeachers'
import { useStudentById } from '@/hooks/useStudents'
import { useParentById } from '@/hooks/useParents'
import { useEntryTestById } from '@/hooks/useEntryTests'
import { useAssessmentById } from '@/hooks/useGrades'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const matches = useMatches()
  const params = matches.reduce((acc, m) => ({ ...acc, ...m.params }), {}) as Record<string, string>
  const routeId = matches[matches.length - 1]?.routeId ?? ''

  const classId = params.classId ?? ''
  const lessonId = params.lessonId ?? ''
  const staffId = params.staffId ?? ''
  const teacherId = params.teacherId ?? ''
  const studentId = params.studentId ?? ''
  const parentId = params.parentId ?? ''
  const entryTestId = params.entryTestId ?? ''
  const assessmentId = params.assessmentId ?? ''

  const { data: cls } = useClassById(classId)
  const { data: lesson } = useLessonById(lessonId)
  const { data: staff } = useStaffById(staffId)
  const { data: teacher } = useTeacherById(teacherId)
  const { data: student } = useStudentById(studentId)
  const { data: parent } = useParentById(parentId)
  const { data: entryTest } = useEntryTestById(entryTestId)
  const { data: assessment } = useAssessmentById(assessmentId)

  const className = cls?.name ?? (classId ? '...' : '')
  const lessonTitle = lesson?.title ?? (lessonId ? '...' : '')
  const staffName = staff?.name ?? (staffId ? '...' : '')
  const teacherName = teacher?.name ?? (teacherId ? '...' : '')
  const studentName = student?.name ?? (studentId ? '...' : '')
  const parentName = parent?.name ?? (parentId ? '...' : '')
  const entryTestName = entryTest?.name ?? (entryTestId ? '...' : '')
  const assessmentTitle = assessment?.title ?? (assessmentId ? '...' : '')

  // Admin class routes
  if (routeId.includes('/classes/') && routeId.includes('/_admin/')) {
    const base: BreadcrumbItem[] = [{ label: 'Classes', to: '/classes' }]
    if (!classId) return base

    const classItem: BreadcrumbItem = { label: className, to: `/classes/${classId}` }

    if (routeId.endsWith('/classes/$classId/') || routeId.endsWith('/classes/$classId')) {
      return [...base, { label: className }]
    }
    if (routeId.endsWith('/edit')) {
      if (lessonId) return [...base, classItem, { label: lessonTitle, to: `/classes/${classId}/lessons/${lessonId}` }, { label: 'Edit' }]
      return [...base, classItem, { label: 'Edit' }]
    }
    if (routeId.endsWith('/grades')) {
      if (lessonId) return [...base, classItem, { label: lessonTitle, to: `/classes/${classId}/lessons/${lessonId}` }, { label: 'Grades' }]
      return [...base, classItem, { label: 'Grades' }]
    }
    if (routeId.endsWith('/attendance')) {
      return [...base, classItem, { label: lessonTitle, to: `/classes/${classId}/lessons/${lessonId}` }, { label: 'Attendance' }]
    }
    if (routeId.includes('/lessons/$lessonId')) {
      return [...base, classItem, { label: lessonTitle }]
    }
    if (routeId.endsWith('/lessons/new')) {
      return [...base, classItem, { label: 'New Lesson' }]
    }
    if (routeId.endsWith('/assignments/new')) {
      return [...base, classItem, { label: 'New Assignment' }]
    }
    if (routeId.includes('/assignments/$assessmentId')) {
      return [...base, classItem, { label: assessmentTitle }, { label: 'Grade' }]
    }
    return base
  }

  // Teacher class routes
  if (routeId.includes('/teacher/') || routeId.includes('/_teacher/')) {
    const base: BreadcrumbItem[] = [{ label: 'My Classes', to: '/teacher' }]
    if (!classId) return []

    const classItem: BreadcrumbItem = { label: className, to: `/teacher/classes/${classId}` }

    if (routeId.endsWith('/classes/$classId/') || routeId.endsWith('/classes/$classId')) {
      return [...base, { label: className }]
    }
    if (routeId.endsWith('/grades')) {
      if (lessonId) return [...base, classItem, { label: lessonTitle, to: `/teacher/classes/${classId}/lessons/${lessonId}` }, { label: 'Grades' }]
      return [...base, classItem, { label: 'Grades' }]
    }
    if (routeId.endsWith('/attendance')) {
      return [...base, classItem, { label: lessonTitle, to: `/teacher/classes/${classId}/lessons/${lessonId}` }, { label: 'Attendance' }]
    }
    if (routeId.endsWith('/edit')) {
      return [...base, classItem, { label: lessonTitle, to: `/teacher/classes/${classId}/lessons/${lessonId}` }, { label: 'Edit' }]
    }
    if (routeId.includes('/lessons/$lessonId')) {
      return [...base, classItem, { label: lessonTitle }]
    }
    if (routeId.endsWith('/lessons/new')) {
      return [...base, classItem, { label: 'New Lesson' }]
    }
    if (routeId.includes('/assignments/$assessmentId')) {
      return [...base, classItem, { label: assessmentTitle }, { label: 'Grade' }]
    }
    return base
  }

  // Staff routes
  if (routeId.includes('/staff/')) {
    const base: BreadcrumbItem[] = [{ label: 'Staff', to: '/staff' }]
    if (routeId.endsWith('/staff/new')) return [...base, { label: 'New' }]
    if (staffId) {
      const item: BreadcrumbItem = { label: staffName, to: `/staff/${staffId}` }
      if (routeId.endsWith('/edit')) return [...base, item, { label: 'Edit' }]
      return [...base, { label: staffName }]
    }
    return base
  }

  // Teacher routes
  if (routeId.includes('/teachers/')) {
    const base: BreadcrumbItem[] = [{ label: 'Teachers', to: '/teachers' }]
    if (routeId.endsWith('/teachers/new')) return [...base, { label: 'New' }]
    if (teacherId) {
      const item: BreadcrumbItem = { label: teacherName, to: `/teachers/${teacherId}` }
      if (routeId.endsWith('/edit')) return [...base, item, { label: 'Edit' }]
      return [...base, { label: teacherName }]
    }
    return base
  }

  // Student routes
  if (routeId.includes('/students/')) {
    const base: BreadcrumbItem[] = [{ label: 'Students', to: '/students' }]
    if (routeId.endsWith('/students/new')) return [...base, { label: 'New' }]
    if (studentId) {
      const item: BreadcrumbItem = { label: studentName, to: `/students/${studentId}` }
      if (routeId.endsWith('/edit')) return [...base, item, { label: 'Edit' }]
      return [...base, { label: studentName }]
    }
    return base
  }

  // Parent routes
  if (routeId.includes('/parents/')) {
    const base: BreadcrumbItem[] = [{ label: 'Parents', to: '/parents' }]
    if (routeId.endsWith('/parents/new')) return [...base, { label: 'New' }]
    if (parentId) {
      const item: BreadcrumbItem = { label: parentName, to: `/parents/${parentId}` }
      if (routeId.endsWith('/edit')) return [...base, item, { label: 'Edit' }]
      return [...base, { label: parentName }]
    }
    return base
  }

  // Entry test routes
  if (routeId.includes('/entry-tests/')) {
    const base: BreadcrumbItem[] = [{ label: 'Entry Tests', to: '/entry-tests' }]
    if (routeId.endsWith('/entry-tests/new')) return [...base, { label: 'New' }]
    if (entryTestId) {
      const item: BreadcrumbItem = { label: entryTestName, to: `/entry-tests/${entryTestId}` }
      if (routeId.endsWith('/edit')) return [...base, item, { label: 'Edit' }]
      return [...base, { label: entryTestName }]
    }
    return base
  }

  // Standalone lesson routes
  if (routeId.includes('/lessons/')) {
    const base: BreadcrumbItem[] = [{ label: 'Lessons', to: '/lessons' }]
    if (routeId.endsWith('/lessons/new')) return [...base, { label: 'New' }]
    if (lessonId) return [...base, { label: lessonTitle }]
    return base
  }

  // Top-level list pages
  if (routeId.endsWith('/staff/') || routeId.endsWith('/staff')) return [{ label: 'Staff' }]
  if (routeId.endsWith('/teachers/') || routeId.endsWith('/teachers')) return [{ label: 'Teachers' }]
  if (routeId.endsWith('/students/') || routeId.endsWith('/students')) return [{ label: 'Students' }]
  if (routeId.endsWith('/parents/') || routeId.endsWith('/parents')) return [{ label: 'Parents' }]
  if (routeId.endsWith('/classes/') || routeId.endsWith('/classes')) return [{ label: 'Classes' }]
  if (routeId.endsWith('/lessons/') || routeId.endsWith('/lessons')) return [{ label: 'Lessons' }]
  if (routeId.endsWith('/entry-tests/') || routeId.endsWith('/entry-tests')) return [{ label: 'Entry Tests' }]
  if (routeId.includes('/feedback')) return [{ label: 'Feedback' }]
  if (routeId.includes('/_teacher/teacher/') && !classId) return [{ label: 'My Classes' }]

  return []
}
