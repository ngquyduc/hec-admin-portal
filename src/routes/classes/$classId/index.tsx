import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents, useRemoveStudentFromClass, useAddStudentToClass } from '@/hooks/useClasses'
import { useLessonsByClass, useDeleteLesson } from '@/hooks/useLessons'
import { useStudents } from '@/hooks/useStudents'
import { useTeacherById } from '@/hooks/useTeachers'
import { ENGLISH_LEVEL_LABELS, STATUS_COLORS, STATUS_LABELS, LESSON_STATUS_LABELS, LESSON_STATUS_COLORS } from '@/lib/constants'
import { Plus, Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/classes/$classId/')({
  component: ClassDetailPage,
})

function ClassDetailPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: classData, isLoading, error } = useClassById(classId)
  const { data: teacherData } = useTeacherById(classData?.teacherId ?? '')
  const { data: assistantData } = useTeacherById(classData?.assistantId ?? '')
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: lessons = [] } = useLessonsByClass(classId)
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Loading class...
        </div>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
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
            <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
            <span className={`px-2 py-1 text-xs rounded font-medium ${STATUS_COLORS[classData.status]}`}>
              {STATUS_LABELS[classData.status]}
            </span>
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded font-medium">
              {ENGLISH_LEVEL_LABELS[classData.level]}
            </span>
          </div>
          {classData.description && (
            <p className="text-gray-600">{classData.description}</p>
          )}
        </div>
        <Link
          to="/classes/$classId/edit"
          params={{ classId }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit Class
        </Link>
      </div>

      {/* Class Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Info</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Main Teacher</dt>
            <dd className="mt-1 font-medium text-gray-900">{teacherData?.name ?? classData.teacherId}</dd>
          </div>
          {classData.assistantId && (
            <div>
              <dt className="text-sm text-gray-500">Teaching Assistant</dt>
              <dd className="mt-1 font-medium text-gray-900">{assistantData?.name ?? classData.assistantId}</dd>
            </div>
          )}
          {classData.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm text-gray-500">Notes</dt>
              <dd className="mt-1 text-gray-700">{classData.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Students ({enrolledStudents.length})
          </h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddDropdown((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </button>
            {showAddDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {unenrolledStudents.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">No students to add</p>
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
                        className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{s.name}</span>
                        {s.phone && <span className="ml-2 text-gray-500">{s.phone}</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {enrolledStudents.length === 0 ? (
          <p className="text-gray-500 text-sm">No students enrolled yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {enrolledStudents.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-900">{s.name}</span>
                  {s.phone && <span className="ml-2 text-sm text-gray-500">{s.phone}</span>}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm(`Remove ${s.name} from this class?`)) {
                      await removeStudent.mutateAsync({ classId, studentId: s.id })
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove from class"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lessons */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Lessons ({lessons.length})
          </h2>
          <Link
            to="/classes/$classId/lessons/new"
            params={{ classId }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>

        {lessons.length === 0 ? (
          <p className="text-gray-500 text-sm">No lessons yet. Add the first lesson.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-900">{lesson.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {new Date(lesson.startTime).toLocaleString()} →{' '}
                    {new Date(lesson.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs rounded font-medium ${LESSON_STATUS_COLORS[lesson.status]}`}>
                    {LESSON_STATUS_LABELS[lesson.status]}
                  </span>
                  <button
                    onClick={() =>
                    navigate({
                      to: '/classes/$classId/lessons/$lessonId/edit',
                      params: { classId, lessonId: lesson.id },
                    })
                  }
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit lesson"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete lesson "${lesson.title}"?`)) {
                        await deleteLesson.mutateAsync(lesson.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete lesson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
