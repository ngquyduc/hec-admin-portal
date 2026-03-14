import { createFileRoute } from '@tanstack/react-router'
import { useLessonById } from '@/hooks/useLessons'
import { LessonForm } from '@/components/forms/LessonForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/lessons/$lessonId/edit')({
  component: EditLessonPage,
})

function EditLessonPage() {
  const { classId, lessonId } = Route.useParams()
  const { data: lesson, isLoading, error } = useLessonById(lessonId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading lesson...
          </CardContent>
        </Card>
      </div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Lesson</h1>
        <p className="text-muted-foreground mt-1">{lesson.title}</p>
      </div>
      <Card>
        <CardContent className="p-6">
        <LessonForm mode="edit" classId={classId} lesson={lesson} />
        </CardContent>
      </Card>
    </div>
  )
}
