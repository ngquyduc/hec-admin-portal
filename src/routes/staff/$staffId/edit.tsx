import { createFileRoute } from '@tanstack/react-router'
import { useStaffById } from '@/hooks/useStaff'
import { StaffForm } from '@/components/forms/StaffForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/staff/$staffId/edit')({
  component: EditStaffPage,
})

function EditStaffPage() {
  const { staffId } = Route.useParams()
  const { data: staff, isLoading, error } = useStaffById(staffId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading staff...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !staff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading staff: {error?.message || 'Staff not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Staff</h1>
        <p className="text-muted-foreground mt-1">Update {staff.name}'s information</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <StaffForm mode="edit" staff={staff} />
        </CardContent>
      </Card>
    </div>
  )
}
