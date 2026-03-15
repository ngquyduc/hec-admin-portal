import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents, useRemoveStudentFromClass, useAddStudentToClass } from '@/hooks/useClasses'
import { useLessonsByClass, useDeleteLesson, useLessonAttendance } from '@/hooks/useLessons'
import { useClassAssessments } from '@/hooks/useGrades'
import { useStudents } from '@/hooks/useStudents'
import { useTeachers } from '@/hooks/useTeachers'
import { CLASS_LEVEL_LABELS, STATUS_COLORS, STATUS_LABELS, LESSON_STATUS_LABELS, LESSON_STATUS_COLORS, ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { Lesson } from '@/types/entities'
import { Plus, Pencil, Trash2, UserMinus, UserPlus, ClipboardList, CheckCircle, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/')({
  component: ClassDetailPage,
})

function LessonRow({
  lesson,
  classId,
  onDelete,
}: {
  lesson: Lesson
  classId: string
  onDelete: () => void
}) {
  const navigate = useNavigate()
  const { data: attendance = [] } = useLessonAttendance(lesson.id)
  const attendanceTaken = attendance.length > 0

  return (
    <li className="flex items-start justify-between py-3 gap-4">
      <div className="min-w-0">
        <div className="font-medium">{lesson.title}</div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {new Date(lesson.startTime).toLocaleString()} →{' '}
          {new Date(lesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="mt-1">
          {attendanceTaken ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="h-3.5 w-3.5" />
              Đã điểm danh
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Chưa điểm danh</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge className={LESSON_STATUS_COLORS[lesson.status]}>
          {LESSON_STATUS_LABELS[lesson.status]}
        </Badge>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            navigate({
              to: '/classes/$classId/lessons/$lessonId/attendance',
              params: { classId, lessonId: lesson.id },
            })
          }
          title="Điểm danh"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Điểm danh
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            navigate({
              to: '/classes/$classId/lessons/$lessonId/edit',
              params: { classId, lessonId: lesson.id },
            })
          }
          title="Edit lesson"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          title="Delete lesson"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}

function ClassDetailPage() {
  const { classId } = Route.useParams()

  const { data: classData, isLoading, error } = useClassById(classId)
  const { data: teachers = [] } = useTeachers()
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: lessons = [] } = useLessonsByClass(classId)
  const { data: assessments = [] } = useClassAssessments(classId)
  const removeStudent = useRemoveStudentFromClass()
  const addStudent = useAddStudentToClass()
  const deleteLesson = useDeleteLesson()

  const [studentSearch, setStudentSearch] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)

  const enrolledIds = new Set(enrolledLinks.map((l) => l.studentId))
  const enrolledStudents = allStudents.filter((s) => enrolledIds.has(s.id))
  const unenrolledStudents = allStudents.filter(
    (s) => !enrolledIds.has(s.id) && s.name.toLowerCase().includes(studentSearch.toLowerCase()),
  )

  const teacherNameMap = new Map(teachers.map((teacher) => [teacher.id, teacher.name]))
  const lessonTitleMap = new Map(lessons.map((lesson) => [lesson.id, lesson.title]))
  const mainTeacherNames = classData
    ? classData.mainTeacherIds.map((teacherId) => teacherNameMap.get(teacherId) ?? teacherId)
    : []
  const assistantNames = classData
    ? classData.teachingAssistantIds.map((teacherId) => teacherNameMap.get(teacherId) ?? teacherId)
    : []

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading class...</CardContent>
      </Card>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading class: {error?.message || 'Class not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{classData.name}</h1>
            <Badge className={STATUS_COLORS[classData.status]}>
              {STATUS_LABELS[classData.status]}
            </Badge>
            <Badge variant="secondary">
              {CLASS_LEVEL_LABELS[classData.level]}
            </Badge>
          </div>
          {classData.description && (
            <p className="text-muted-foreground">{classData.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/classes/$classId/grades" params={{ classId }}>
              <BookOpen className="h-4 w-4" />
              Bảng điểm
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/classes/$classId/edit" params={{ classId }}>
              <Pencil className="h-4 w-4" />
              Edit Class
            </Link>
          </Button>
        </div>
      </div>

      {/* Class Info */}
      <Card>
        <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Class Info</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Main Teachers</dt>
            <dd className="mt-1 font-medium">{mainTeacherNames.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Teaching Assistants</dt>
            <dd className="mt-1 font-medium">{assistantNames.join(', ')}</dd>
          </div>
          {classData.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1">{classData.notes}</dd>
            </div>
          )}
        </dl>
        </CardContent>
      </Card>

      {/* Lessons */}
      <Card>
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Lessons ({lessons.length})
          </h2>
          <Button asChild size="sm">
            <Link to="/classes/$classId/lessons/new" params={{ classId }}>
              <Plus className="h-4 w-4" />
              Add Lesson
            </Link>
          </Button>
        </div>

        {lessons.length === 0 ? (
          <p className="text-muted-foreground text-sm">No lessons yet. Add the first lesson.</p>
        ) : (
          <ul className="divide-y">
            {lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                classId={classId}
                onDelete={async () => {
                  if (confirm(`Delete lesson "${lesson.title}"?`)) {
                    await deleteLesson.mutateAsync(lesson.id)
                  }
                }}
              />
            ))}
          </ul>
        )}
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card>
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Assignments ({assessments.length})
          </h2>
          <Button asChild size="sm">
            <Link to="/classes/$classId/assignments/new" params={{ classId }}>
              <Plus className="h-4 w-4" />
              Add Assignment
            </Link>
          </Button>
        </div>

        {assessments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No assignments yet.</p>
        ) : (
          <ul className="divide-y">
            {assessments.map((assessment) => (
              <li key={assessment.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{assessment.title}</p>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Loại: {ASSESSMENT_TYPE_LABELS[assessment.type]}</span>
                    <span>Điểm tối đa: {assessment.maxScore}</span>
                    {assessment.lessonId && (
                      <span>Bài học: {lessonTitleMap.get(assessment.lessonId) ?? 'N/A'}</span>
                    )}
                    {assessment.dueAt && (
                      <span>Hạn nộp: {new Date(assessment.dueAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      to="/classes/$classId/assignments/$assessmentId/grade"
                      params={{ classId, assessmentId: assessment.id }}
                    >
                      Chấm điểm
                    </Link>
                  </Button>
                  <Badge variant="secondary">{ASSESSMENT_TYPE_LABELS[assessment.type]}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
        </CardContent>
      </Card>

      {/* Students */}
      <Card>
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Students ({enrolledStudents.length})
          </h2>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddDropdown((v) => !v)}
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
            {showAddDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-72 bg-popover border rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <Input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students..."
                    className="h-8 text-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {unenrolledStudents.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No students to add</p>
                  ) : (
                    unenrolledStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={async () => {
                          await addStudent.mutateAsync({ classId, studentId: s.id })
                          setShowAddDropdown(false)
                          setStudentSearch('')
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <span className="font-medium">{s.name}</span>
                        {s.phone && <span className="ml-2 text-muted-foreground">{s.phone}</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {enrolledStudents.length === 0 ? (
          <p className="text-muted-foreground text-sm">No students enrolled yet.</p>
        ) : (
          <ul className="divide-y">
            {enrolledStudents.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium">{s.name}</span>
                  {s.phone && <span className="ml-2 text-sm text-muted-foreground">{s.phone}</span>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    if (confirm(`Remove ${s.name} from this class?`)) {
                      await removeStudent.mutateAsync({ classId, studentId: s.id })
                    }
                  }}
                  title="Remove from class"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        </CardContent>
      </Card>
    </div>
  )
}
