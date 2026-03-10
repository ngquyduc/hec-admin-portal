import { createFileRoute } from '@tanstack/react-router'
import { StudentForm } from '@/components/forms/StudentForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/students/new')({
  component: NewStudentPage,
})

function NewStudentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Student</h1>
        <p className="text-muted-foreground mt-1">Create a new student record</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <StudentForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
