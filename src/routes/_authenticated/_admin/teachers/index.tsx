import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useTeachers, useDeleteTeacher } from '@/hooks/useTeachers'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { DataTable } from '@/components/DataTable'
import type { Teacher } from '@/types/entities'
import { SUBJECT_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/teachers/')({
  component: TeachersListPage,
})

function TeachersListPage() {
  const { data: teachers = [], isLoading, error } = useTeachers()
  const deleteTeacher = useDeleteTeacher()
  const navigate = useNavigate()
  const { confirm, confirmDialog } = useConfirmDialog()

  const handleDelete = async (id: string, name: string) => {
    if (await confirm({
      title: 'Delete teacher?',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
    })) {
      await deleteTeacher.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          to="/teachers/$teacherId"
          params={{ teacherId: row.original.id }}
          className="font-medium text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {SUBJECT_LABELS[subject]}
            </Badge>
          ))}
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
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: '/teachers/$teacherId/edit', params: { teacherId: row.original.id } })}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
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
          Error loading teachers: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers Management</h1>
        <Button asChild>
          <Link to="/teachers/new">
            <Plus className="h-4 w-4" />
            Add New Teacher
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading teachers...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={teachers}
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
