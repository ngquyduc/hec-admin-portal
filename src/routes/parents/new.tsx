import { createFileRoute } from '@tanstack/react-router'
import { ParentForm } from '@/components/forms/ParentForm'

export const Route = createFileRoute('/parents/new')({
  component: NewParentPage,
})

function NewParentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Parent</h1>
        <p className="text-gray-600 mt-1">Create a new parent record</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ParentForm mode="create" />
      </div>
    </div>
  )
}
