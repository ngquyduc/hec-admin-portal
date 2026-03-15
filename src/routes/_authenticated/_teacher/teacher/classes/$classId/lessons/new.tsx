import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LessonForm } from '@/components/forms/LessonForm'
import { useClassById } from '@/hooks/useClasses'
import { useCurrentUser } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_teacher/teacher/classes/$classId/lessons/new')({
  component: TeacherNewLessonPage,
})

function TeacherNewLessonPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { data: cls, isLoading } = useClassById(classId)

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (!cls) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Class not found.
        </div>
      </div>
    )
  }

  const isAuthorized =
    user?.teacherId === cls.teacherId || user?.teacherId === cls.assistantId

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Access denied. You are not assigned to this class.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Lesson</h1>
        <p className="text-muted-foreground mt-1">Create a new lesson for this class</p>
      </div>
      <Card>
        <CardContent className="p-6">
        <LessonForm
          mode="create"
          classId={classId}
          onSuccess={() =>
            navigate({ to: '/teacher/classes/$classId', params: { classId } })
          }
        />
        </CardContent>
      </Card>
    </div>
  )
}
