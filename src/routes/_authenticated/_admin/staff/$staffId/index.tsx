import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useDeleteStaff, useStaffById } from '@/hooks/useStaff'
import { STAFF_ROLE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/staff/$staffId/')({
  component: StaffDetailPage,
})

function StaffDetailPage() {
  const { staffId } = Route.useParams()
  const navigate = useNavigate()
  const { data: staff, isLoading, error } = useStaffById(staffId)
  const deleteStaff = useDeleteStaff()

  const handleDelete = async () => {
    if (!staff) return
    if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
      await deleteStaff.mutateAsync(staff.id)
      navigate({ to: '/staff' })
    }
  }

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading staff...</CardContent>
      </Card>
    )
  }

  if (error || !staff) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading staff: {error?.message || 'Staff not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{staff.name}</h1>
            <Badge className={STATUS_COLORS[staff.status]}>{STATUS_LABELS[staff.status]}</Badge>
            <Badge variant="secondary">{STAFF_ROLE_LABELS[staff.role]}</Badge>
          </div>
          <p className="text-muted-foreground">Staff details</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/staff">
              <ArrowLeft className="h-4 w-4" />
              Back to Staff
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/staff/$staffId/edit" params={{ staffId: staff.id }}>
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
          <h2 className="text-lg font-semibold mb-4">Staff Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{staff.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{staff.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Hire Date</dt>
              <dd className="mt-1 font-medium">{new Date(staff.hireDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Address</dt>
              <dd className="mt-1">{staff.address || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Emergency Contact</dt>
              <dd className="mt-1">{staff.emergencyContact || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{staff.notes || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
