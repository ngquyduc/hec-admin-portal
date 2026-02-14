import { createFileRoute } from '@tanstack/react-router'
import { StudentForm } from '@/components/forms/StudentForm'

export const Route = createFileRoute('/students/new')({
  component: NewStudentPage,
})

function NewStudentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-600 mt-1">Create a new student record</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <StudentForm mode="create" />
      </div>
    </div>
  )
}
