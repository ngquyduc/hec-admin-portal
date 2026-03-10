import { createFileRoute } from '@tanstack/react-router'
import { LessonForm } from '@/components/forms/LessonForm'

export const Route = createFileRoute('/classes/$classId/lessons/new')({
  component: NewLessonPage,
})

function NewLessonPage() {
  const { classId } = Route.useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Lesson</h1>
        <p className="text-gray-600 mt-1">Create a new lesson for this class</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <LessonForm mode="create" classId={classId} />
      </div>
    </div>
  )
}
