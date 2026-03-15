import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LessonForm } from '@/components/forms/LessonForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/lessons/new')({
  component: NewLessonPage,
})

function NewLessonPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New lesson</h1>
        <p className="text-muted-foreground mt-1">Create a new lesson and link it to a class</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <LessonForm
            mode="create"
            allowClassSelection
            onSuccess={() => navigate({ to: '/lessons' })}
            onCancel={() => navigate({ to: '/lessons' })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
