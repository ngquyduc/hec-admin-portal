import { createFileRoute } from '@tanstack/react-router'
import { useStudentById } from '@/hooks/useStudents'
import { StudentForm } from '@/components/forms/StudentForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/students/$studentId/edit')({
  component: EditStudentPage,
})

function EditStudentPage() {
  const { studentId } = Route.useParams()
  const { data: student, isLoading, error } = useStudentById(studentId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading student...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading student: {error?.message || 'Student not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Student</h1>
        <p className="text-muted-foreground mt-1">Update {student.name}'s information</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <StudentForm mode="edit" student={student} />
        </CardContent>
      </Card>
    </div>
  )
}
