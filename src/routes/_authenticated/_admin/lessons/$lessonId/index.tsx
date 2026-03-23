import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useClassById } from '@/hooks/useClasses'
import { useDeleteLesson, useLessonById } from '@/hooks/useLessons'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { LESSON_STATUS_COLORS, LESSON_STATUS_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/lessons/$lessonId/')({
  component: LessonDetailPage,
})

function LessonDetailPage() {
  const { lessonId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lesson, isLoading, error } = useLessonById(lessonId)
  const { data: classData } = useClassById(lesson?.classId ?? '')
  const deleteLesson = useDeleteLesson()
  const { confirm, confirmDialog } = useConfirmDialog()

  const handleDelete = async () => {
    if (!lesson) return
    if (await confirm({
      title: 'Delete lesson?',
      description: `Delete lesson "${lesson.title}"?`,
      confirmText: 'Delete',
    })) {
      await deleteLesson.mutateAsync(lesson.id)
      navigate({ to: '/lessons' })
    }
  }

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading lesson...</CardContent>
      </Card>
    )
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading lesson: {error?.message || 'Lesson not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <Badge className={LESSON_STATUS_COLORS[lesson.status]}>{LESSON_STATUS_LABELS[lesson.status]}</Badge>
          </div>
          <p className="text-muted-foreground">Lesson details</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/lessons">
              <ArrowLeft className="h-4 w-4" />
              Back to Lessons
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              to="/classes/$classId/lessons/$lessonId/edit"
              params={{ classId: lesson.classId, lessonId: lesson.id }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lesson Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Class</dt>
              <dd className="mt-1 font-medium">
                <Link to="/classes/$classId" params={{ classId: lesson.classId }} className="text-primary hover:underline">
                  {classData?.name || lesson.classId}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Start Time</dt>
              <dd className="mt-1 font-medium">{new Date(lesson.startTime).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">End Time</dt>
              <dd className="mt-1 font-medium">{new Date(lesson.endTime).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Content</dt>
              <dd className="mt-1 whitespace-pre-wrap">{lesson.content || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{lesson.notes || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      {confirmDialog}
    </div>
  )
}
