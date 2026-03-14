import { createFileRoute } from '@tanstack/react-router'
import { TeacherForm } from '@/components/forms/TeacherForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/teachers/new')({
  component: NewTeacherPage,
})

function NewTeacherPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Teacher</h1>
        <p className="text-muted-foreground mt-1">Create a new teacher record</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
        <TeacherForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
