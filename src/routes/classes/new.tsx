import { createFileRoute } from '@tanstack/react-router'
import { ClassForm } from '@/components/forms/ClassForm'

export const Route = createFileRoute('/classes/new')({
  component: NewClassPage,
})

function NewClassPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Class</h1>
        <p className="text-gray-600 mt-1">Create a new class and assign a teacher</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <ClassForm mode="create" />
      </div>
    </div>
  )
}
