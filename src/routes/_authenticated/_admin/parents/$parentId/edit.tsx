import { createFileRoute } from '@tanstack/react-router'
import { useParentById } from '@/hooks/useParents'
import { ParentForm } from '@/components/forms/ParentForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/parents/$parentId/edit')({
  component: EditParentPage,
})

function EditParentPage() {
  const { parentId } = Route.useParams()
  const { data: parent, isLoading, error } = useParentById(parentId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading parent...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !parent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading parent: {error?.message || 'Parent not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Parent</h1>
        <p className="text-muted-foreground mt-1">Update {parent.name}'s information</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <ParentForm mode="edit" parent={parent} />
        </CardContent>
      </Card>
    </div>
  )
}
