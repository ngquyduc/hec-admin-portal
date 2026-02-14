import { createFileRoute } from '@tanstack/react-router'
import { TeacherForm } from '@/components/forms/TeacherForm'

export const Route = createFileRoute('/teachers/new')({
  component: NewTeacherPage,
})

function NewTeacherPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
        <p className="text-gray-600 mt-1">Create a new teacher record</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <TeacherForm mode="create" />
      </div>
    </div>
  )
}
