import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, ClipboardList, CheckCircle } from 'lucide-react'
import { useLessons, useDeleteLesson, useLessonAttendance } from '@/hooks/useLessons'
import { useClasses } from '@/hooks/useClasses'
import { DataTable } from '@/components/DataTable'
import type { Lesson } from '@/types/entities'
import { LESSON_STATUS_LABELS, LESSON_STATUS_COLORS } from '@/lib/constants'

export const Route = createFileRoute('/lessons/')({
  component: LessonsListPage,
})

function AttendanceCell({ lesson }: { lesson: Lesson }) {
  const { data: attendance = [] } = useLessonAttendance(lesson.id)
  const navigate = useNavigate()
  const taken = attendance.length > 0
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          navigate({
            to: '/classes/$classId/lessons/$lessonId/attendance',
            params: { classId: lesson.classId, lessonId: lesson.id },
          })
        }
        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
        title="Điểm danh"
      >
        <ClipboardList className="h-3.5 w-3.5" />
        Điểm danh
      </button>
      {taken && (
        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
          <CheckCircle className="h-3.5 w-3.5" />
          Đã xong
        </span>
      )}
    </div>
  )
}

function LessonsListPage() {
  const { data: lessons = [], isLoading, error } = useLessons()
  const { data: classes = [] } = useClasses()
  const deleteLesson = useDeleteLesson()
  const navigate = useNavigate()

  const classMap = new Map(classes.map((c) => [c.id, c.name]))

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete lesson "${title}"?`)) {
      await deleteLesson.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'classId',
      header: 'Class',
      cell: ({ row }) => (
        <Link
                  to="/classes/$classId"
                  params={{ classId: row.original.classId }}
                  className="text-blue-600 hover:underline text-sm"
                >
          {classMap.get(row.original.classId) ?? row.original.classId}
        </Link>
      ),
    },
    {
      accessorKey: 'startTime',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div className="text-gray-600 text-sm">
          {new Date(row.original.startTime).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded font-medium ${LESSON_STATUS_COLORS[row.original.status]}`}>
          {LESSON_STATUS_LABELS[row.original.status]}
        </span>
      ),
    },
    {
      id: 'attendance',
      header: 'Điểm danh',
      cell: ({ row }) => <AttendanceCell lesson={row.original} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate({
                to: '/classes/$classId/lessons/$lessonId/edit',
                params: { classId: row.original.classId, lessonId: row.original.id },
              })
            }
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id, row.original.title)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading lessons: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Lessons</h1>
        <p className="text-gray-600 mt-1">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} across all classes</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading lessons...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={lessons}
            searchColumn="title"
            searchPlaceholder="Search lessons..."
          />
        </div>
      )}
    </div>
  )
}
