import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonById } from '@/hooks/useLessons'
import { LessonForm } from '@/components/forms/LessonForm'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
  '/_authenticated/_teacher/teacher/classes/$classId/lessons/$lessonId/edit',
)({
  component: TeacherEditLessonPage,
})

function TeacherEditLessonPage() {
  const { classId, lessonId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lesson, isLoading } = useLessonById(lessonId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-muted-foreground">Loading...</div>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-destructive">
        Lesson not found.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm"
        onClick={() =>
          navigate({ to: '/teacher/classes/$classId', params: { classId } })
        }
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to class
      </Button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Lesson</h1>
      </div>
      <Card>
        <CardContent className="p-6">
        <LessonForm
          mode="edit"
          classId={classId}
          lesson={lesson}
          onSuccess={() =>
            navigate({ to: '/teacher/classes/$classId', params: { classId } })
          }
        />
        </CardContent>
      </Card>
    </div>
  )
}
