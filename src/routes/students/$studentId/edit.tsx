import { createFileRoute } from '@tanstack/react-router'
import { useStudentById } from '@/hooks/useStudents'
import { StudentForm } from '@/components/forms/StudentForm'

export const Route = createFileRoute('/students/$studentId/edit')({
  component: EditStudentPage,
})

function EditStudentPage() {
  const { studentId } = Route.useParams()
  const { data: student, isLoading, error } = useStudentById(studentId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading student...</div>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading student: {error?.message || 'Student not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-gray-600 mt-1">Update {student.name}'s information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <StudentForm mode="edit" student={student} />
      </div>
    </div>
  )
}
