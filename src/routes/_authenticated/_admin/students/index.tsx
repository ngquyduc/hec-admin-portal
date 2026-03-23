import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useStudents, useDeleteStudent } from '@/hooks/useStudents'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { DataTable } from '@/components/DataTable'
import type { Student } from '@/types/entities'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/students/')({
  component: StudentsListPage,
})

function StudentsListPage() {
  const { data: students = [], isLoading, error } = useStudents()
  const deleteStudent = useDeleteStudent()
  const navigate = useNavigate()
  const { confirm, confirmDialog } = useConfirmDialog()

  const handleDelete = async (id: string, name: string) => {
    if (await confirm({
      title: 'Delete student?',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
    })) {
      await deleteStudent.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          to="/students/$studentId"
          params={{ studentId: row.original.id }}
          className="font-medium text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.phone || '-'}</div>
      ),
    },
    {
      accessorKey: 'enrollmentDate',
      header: 'Enrolled',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.original.enrollmentDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={STATUS_COLORS[row.original.status]}>
          {STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: {
        disableRowClick: true,
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm"
            onClick={() => navigate({ to: '/students/$studentId/edit', params: { studentId: row.original.id } })}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm"
            onClick={() => handleDelete(row.original.id, row.original.name)}
            title="Delete"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading students: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <Button asChild>
          <Link to="/students/new">
            <Plus className="h-4 w-4" />
            Add New Student
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading students...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={students}
              searchColumn="name"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      )}
      {confirmDialog}
    </div>
  )
}
