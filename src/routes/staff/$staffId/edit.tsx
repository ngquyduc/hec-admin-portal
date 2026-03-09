import { createFileRoute } from '@tanstack/react-router'
import { useStaffById } from '@/hooks/useStaff'
import { StaffForm } from '@/components/forms/StaffForm'

export const Route = createFileRoute('/staff/$staffId/edit')({
  component: EditStaffPage,
})

function EditStaffPage() {
  const { staffId } = Route.useParams()
  const { data: staff, isLoading, error } = useStaffById(staffId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading staff...</div>
        </div>
      </div>
    )
  }

  if (error || !staff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading staff: {error?.message || 'Staff not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Staff</h1>
        <p className="text-gray-600 mt-1">Update {staff.name}'s information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <StaffForm mode="edit" staff={staff} />
      </div>
    </div>
  )
}
