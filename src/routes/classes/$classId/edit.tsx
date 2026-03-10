import { createFileRoute } from '@tanstack/react-router'
import { useClassById } from '@/hooks/useClasses'
import { ClassForm } from '@/components/forms/ClassForm'

export const Route = createFileRoute('/classes/$classId/edit')({
  component: EditClassPage,
})

function EditClassPage() {
  const { classId } = Route.useParams()
  const { data: classData, isLoading, error } = useClassById(classId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Loading class...
        </div>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading class: {error?.message || 'Class not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Class</h1>
        <p className="text-gray-600 mt-1">Update "{classData.name}"</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <ClassForm mode="edit" classData={classData} />
      </div>
    </div>
  )
}
