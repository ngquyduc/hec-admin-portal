import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, ClipboardList, CheckCircle } from 'lucide-react'
import { useLessons, useDeleteLesson, useLessonAttendance } from '@/hooks/useLessons'
import { useClasses } from '@/hooks/useClasses'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { DataTable } from '@/components/DataTable'
import type { Lesson } from '@/types/entities'
import { LESSON_STATUS_LABELS, LESSON_STATUS_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_admin/lessons/')({
  component: LessonsListPage,
})

function AttendanceCell({ lesson }: { lesson: Lesson }) {
  const { data: attendance = [] } = useLessonAttendance(lesson.id)
  const navigate = useNavigate()
  const taken = attendance.length > 0
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm"
        onClick={() =>
          navigate({
            to: '/classes/$classId/lessons/$lessonId/attendance',
            params: { classId: lesson.classId, lessonId: lesson.id },
          })
        }
        title="Điểm danh"
      >
        <ClipboardList className="h-3.5 w-3.5" />
        Điểm danh
      </Button>
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
  const { confirm, confirmDialog } = useConfirmDialog()

  const classMap = new Map(classes.map((c) => [c.id, c.name]))

  const handleDelete = async (id: string, title: string) => {
    if (await confirm({
      title: 'Delete lesson?',
      description: `Delete lesson "${title}"?`,
      confirmText: 'Delete',
    })) {
      await deleteLesson.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <Link
          to="/lessons/$lessonId"
          params={{ lessonId: row.original.id }}
          className="font-medium text-primary hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: 'classId',
      header: 'Class',
      meta: {
        disableRowClick: true,
      },
      cell: ({ row }) => (
        <Link
          to="/classes/$classId"
          params={{ classId: row.original.classId }}
          className="text-primary hover:underline text-sm"
        >
          {classMap.get(row.original.classId) ?? row.original.classId}
        </Link>
      ),
    },
    {
      accessorKey: 'startTime',
      header: 'Date & Time',
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {new Date(row.original.startTime).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={LESSON_STATUS_COLORS[row.original.status]}>
          {LESSON_STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'attendance',
      header: 'Điểm danh',
      meta: {
        disableRowClick: true,
      },
      cell: ({ row }) => <AttendanceCell lesson={row.original} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: {
        disableRowClick: true,
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm"
            onClick={() =>
              navigate({
                to: '/classes/$classId/lessons/$lessonId/edit',
                params: { classId: row.original.classId, lessonId: row.original.id },
              })
            }
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm"
            onClick={() => handleDelete(row.original.id, row.original.title)}
            title="Delete"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading lessons: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Lessons</h1>
        <p className="text-muted-foreground mt-1">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} across all classes</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading lessons...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={lessons}
              searchColumn="title"
              searchPlaceholder="Search lessons..."
              toolbarContent={(
                <Button asChild>
                  <Link to="/lessons/new">
                    <Plus className="h-4 w-4" />
                    New Lesson
                  </Link>
                </Button>
              )}
            />
          </CardContent>
        </Card>
      )}
      {confirmDialog}
    </div>
  )
}
