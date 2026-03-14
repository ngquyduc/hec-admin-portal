import { createFileRoute } from '@tanstack/react-router'
import { ClassForm } from '@/components/forms/ClassForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/classes/new')({
  component: NewClassPage,
})

function NewClassPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Class</h1>
        <p className="text-muted-foreground mt-1">Create a new class and assign a teacher</p>
      </div>
      <Card>
        <CardContent className="p-6">
        <ClassForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
