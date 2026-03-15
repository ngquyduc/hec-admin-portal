import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useDeleteTeacher, useTeacherById } from '@/hooks/useTeachers'
import { STATUS_COLORS, STATUS_LABELS, SUBJECT_LABELS, TEACHER_ROLE_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/teachers/$teacherId/')({
  component: TeacherDetailPage,
})

function TeacherDetailPage() {
  const { teacherId } = Route.useParams()
  const navigate = useNavigate()
  const { data: teacher, isLoading, error } = useTeacherById(teacherId)
  const deleteTeacher = useDeleteTeacher()

  const handleDelete = async () => {
    if (!teacher) return
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      await deleteTeacher.mutateAsync(teacher.id)
      navigate({ to: '/teachers' })
    }
  }

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading teacher...</CardContent>
      </Card>
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <Badge className={STATUS_COLORS[teacher.status]}>{STATUS_LABELS[teacher.status]}</Badge>
            <Badge variant="secondary">{TEACHER_ROLE_LABELS[teacher.role]}</Badge>
          </div>
          <p className="text-muted-foreground">Teacher details</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/teachers">
              <ArrowLeft className="h-4 w-4" />
              Back to Teachers
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/teachers/$teacherId/edit" params={{ teacherId: teacher.id }}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Teacher Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{teacher.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{teacher.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Hire Date</dt>
              <dd className="mt-1 font-medium">{new Date(teacher.hireDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Subjects</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {teacher.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {SUBJECT_LABELS[subject]}
                  </Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Address</dt>
              <dd className="mt-1">{teacher.address || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Emergency Contact</dt>
              <dd className="mt-1">{teacher.emergencyContact || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{teacher.notes || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
