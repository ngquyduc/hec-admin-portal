import { createFileRoute } from '@tanstack/react-router'
import { useTeacherById } from '@/hooks/useTeachers'
import { TeacherForm } from '@/components/forms/TeacherForm'

export const Route = createFileRoute('/teachers/$teacherId/edit')({
  component: EditTeacherPage,
})

function EditTeacherPage() {
  const { teacherId } = Route.useParams()
  const { data: teacher, isLoading, error } = useTeacherById(teacherId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading teacher...</div>
        </div>
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading teacher: {error?.message || 'Teacher not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Teacher</h1>
        <p className="text-gray-600 mt-1">Update {teacher.name}'s information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <TeacherForm mode="edit" teacher={teacher} />
      </div>
    </div>
  )
}
