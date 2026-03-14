import { createFileRoute } from '@tanstack/react-router'
import { useTeacherById } from '@/hooks/useTeachers'
import { TeacherForm } from '@/components/forms/TeacherForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/teachers/$teacherId/edit')({
  component: EditTeacherPage,
})

function EditTeacherPage() {
  const { teacherId } = Route.useParams()
  const { data: teacher, isLoading, error } = useTeacherById(teacherId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading teacher...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading teacher: {error?.message || 'Teacher not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Teacher</h1>
        <p className="text-muted-foreground mt-1">Update {teacher.name}'s information</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <TeacherForm mode="edit" teacher={teacher} />
        </CardContent>
      </Card>
    </div>
  )
}
