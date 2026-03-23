import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useDeleteStudent, useStudentById } from '@/hooks/useStudents'
import { useParentById } from '@/hooks/useParents'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/students/$studentId/')({
  component: StudentDetailPage,
})

function StudentDetailPage() {
  const { studentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: student, isLoading, error } = useStudentById(studentId)
  const { data: parent } = useParentById(student?.parentId ?? '')
  const deleteStudent = useDeleteStudent()
  const { confirm, confirmDialog } = useConfirmDialog()

  const handleDelete = async () => {
    if (!student) return
    if (await confirm({
      title: 'Delete student?',
      description: `Are you sure you want to delete ${student.name}?`,
      confirmText: 'Delete',
    })) {
      await deleteStudent.mutateAsync(student.id)
      navigate({ to: '/students' })
    }
  }

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading student...</CardContent>
      </Card>
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <Badge className={STATUS_COLORS[student.status]}>{STATUS_LABELS[student.status]}</Badge>
          </div>
          <p className="text-muted-foreground">Student details</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/students">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/students/$studentId/edit" params={{ studentId: student.id }}>
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
          <h2 className="text-lg font-semibold mb-4">Student Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{student.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{student.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Date of Birth</dt>
              <dd className="mt-1 font-medium">
                {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Enrollment Date</dt>
              <dd className="mt-1 font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Entry Result</dt>
              <dd className="mt-1">{student.entryResult || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Exit Target</dt>
              <dd className="mt-1">{student.exitTarget || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Parent</dt>
              <dd className="mt-1 font-medium">
                {student.parentId ? (
                  <Link
                    to="/parents/$parentId"
                    params={{ parentId: student.parentId }}
                    className="text-primary hover:underline"
                  >
                    {parent?.name || 'View parent'}
                  </Link>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Address</dt>
              <dd className="mt-1">{student.address || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{student.notes || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      {confirmDialog}
    </div>
  )
}
