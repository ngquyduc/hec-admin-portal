import { createFileRoute } from '@tanstack/react-router'
import { useParentById } from '@/hooks/useParents'
import { ParentForm } from '@/components/forms/ParentForm'

export const Route = createFileRoute('/parents/$parentId/edit')({
  component: EditParentPage,
})

function EditParentPage() {
  const { parentId } = Route.useParams()
  const { data: parent, isLoading, error } = useParentById(parentId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading parent...</div>
        </div>
      </div>
    )
  }

  if (error || !parent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading parent: {error?.message || 'Parent not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Parent</h1>
        <p className="text-gray-600 mt-1">Update {parent.firstName} {parent.lastName}'s information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ParentForm mode="edit" parent={parent} />
      </div>
    </div>
  )
}
