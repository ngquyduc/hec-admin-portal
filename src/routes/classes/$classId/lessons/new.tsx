import { createFileRoute } from '@tanstack/react-router'
import { LessonForm } from '@/components/forms/LessonForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/classes/$classId/lessons/new')({
  component: NewLessonPage,
})

function NewLessonPage() {
  const { classId } = Route.useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Lesson</h1>
        <p className="text-muted-foreground mt-1">Create a new lesson for this class</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <LessonForm mode="create" classId={classId} />
        </CardContent>
      </Card>
    </div>
  )
}
