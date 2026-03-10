import { createFileRoute } from '@tanstack/react-router'
import { useClassById } from '@/hooks/useClasses'
import { ClassForm } from '@/components/forms/ClassForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/classes/$classId/edit')({
  component: EditClassPage,
})

function EditClassPage() {
  const { classId } = Route.useParams()
  const { data: classData, isLoading, error } = useClassById(classId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading class...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading class: {error?.message || 'Class not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Class</h1>
        <p className="text-muted-foreground mt-1">Update "{classData.name}"</p>
      </div>
      <Card>
        <CardContent className="p-6">
        <ClassForm mode="edit" classData={classData} />
        </CardContent>
      </Card>
    </div>
  )
}
