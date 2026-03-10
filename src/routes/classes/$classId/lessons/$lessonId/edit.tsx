import { createFileRoute } from '@tanstack/react-router'
import { useLessonById } from '@/hooks/useLessons'
import { LessonForm } from '@/components/forms/LessonForm'

export const Route = createFileRoute('/classes/$classId/lessons/$lessonId/edit')({
  component: EditLessonPage,
})

function EditLessonPage() {
  const { classId, lessonId } = Route.useParams()
  const { data: lesson, isLoading, error } = useLessonById(lessonId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Loading lesson...
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading lesson: {error?.message || 'Lesson not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Lesson</h1>
        <p className="text-gray-600 mt-1">{lesson.title}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <LessonForm mode="edit" classId={classId} lesson={lesson} />
      </div>
    </div>
  )
}
