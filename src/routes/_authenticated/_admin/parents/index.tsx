import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useParents, useDeleteParent } from '@/hooks/useParents'
import { DataTable } from '@/components/DataTable'
import type { Parent } from '@/types/entities'
import { RELATIONSHIP_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/parents/')({
  component: ParentsListPage,
})

function ParentsListPage() {
  const { data: parents = [], isLoading, error } = useParents()
  const deleteParent = useDeleteParent()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteParent.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Parent>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
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
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: 'relationship',
      header: 'Relationship',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {RELATIONSHIP_LABELS[row.original.relationship]}
        </Badge>
      ),
    },
    {
      accessorKey: 'studentIds',
      header: 'Students',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.studentIds.length} student{row.original.studentIds.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: '/parents/$parentId/edit', params: { parentId: row.original.id } })}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(row.original.id, row.original.name)}
            title="Delete"
            className="text-destructive hover:text-destructive"
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
          Error loading parents: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parents Management</h1>
        <Button asChild>
          <Link to="/parents/new">
            <Plus className="h-4 w-4" />
            Add New Parent
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading parents...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={parents}
              searchColumn="name"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
