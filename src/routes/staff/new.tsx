import { createFileRoute } from '@tanstack/react-router'
import { StaffForm } from '@/components/forms/StaffForm'

export const Route = createFileRoute('/staff/new')({
  component: NewStaffPage,
})

function NewStaffPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Staff</h1>
        <p className="text-gray-600 mt-1">Create a new staff member record</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <StaffForm mode="create" />
      </div>
    </div>
  )
}
