import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useDeleteParent, useParentById } from '@/hooks/useParents'
import { useStudents } from '@/hooks/useStudents'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { RELATIONSHIP_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/parents/$parentId/')({
  component: ParentDetailPage,
})

function ParentDetailPage() {
  const { parentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: parent, isLoading, error } = useParentById(parentId)
  const { data: students = [] } = useStudents()
  const deleteParent = useDeleteParent()
  const { confirm, confirmDialog } = useConfirmDialog()

  const studentsById = new Map(students.map((student) => [student.id, student]))

  const handleDelete = async () => {
    if (!parent) return
    if (await confirm({
      title: 'Delete parent?',
      description: `Are you sure you want to delete ${parent.name}?`,
      confirmText: 'Delete',
    })) {
      await deleteParent.mutateAsync(parent.id)
      navigate({ to: '/parents' })
    }
  }

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading parent...</CardContent>
      </Card>
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{parent.name}</h1>
            <Badge variant="secondary">{RELATIONSHIP_LABELS[parent.relationship]}</Badge>
          </div>
          <p className="text-muted-foreground">Parent details</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/parents">
              <ArrowLeft className="h-4 w-4" />
              Back to Parents
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/parents/$parentId/edit" params={{ parentId: parent.id }}>
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
          <h2 className="text-lg font-semibold mb-4">Parent Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{parent.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{parent.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Occupation</dt>
              <dd className="mt-1">{parent.occupation || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Address</dt>
              <dd className="mt-1">{parent.address || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Students</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {parent.studentIds.length === 0 ? (
                  '—'
                ) : (
                  parent.studentIds.map((studentId) => (
                    <Link
                      key={studentId}
                      to="/students/$studentId"
                      params={{ studentId }}
                      className="text-primary hover:underline text-sm"
                    >
                      {studentsById.get(studentId)?.name || studentId}
                    </Link>
                  ))
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{parent.notes || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      {confirmDialog}
    </div>
  )
}
