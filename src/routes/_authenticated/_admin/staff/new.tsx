import { createFileRoute } from '@tanstack/react-router'
import { StaffForm } from '@/components/forms/StaffForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/staff/new')({
  component: NewStaffPage,
})

function NewStaffPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Staff</h1>
        <p className="text-muted-foreground mt-1">Create a new staff member record</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <StaffForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
