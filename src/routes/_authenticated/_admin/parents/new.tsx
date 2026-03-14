import { createFileRoute } from '@tanstack/react-router'
import { ParentForm } from '@/components/forms/ParentForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/parents/new')({
  component: NewParentPage,
})

function NewParentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Parent</h1>
        <p className="text-muted-foreground mt-1">Create a new parent record</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <ParentForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
