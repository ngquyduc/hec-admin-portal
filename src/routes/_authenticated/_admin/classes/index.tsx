import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useClasses, useDeleteClass } from '@/hooks/useClasses'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { DataTable } from '@/components/DataTable'
import type { Class, Status } from '@/types/entities'
import { CLASS_LEVEL_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/_admin/classes/')({
  component: ClassesListPage,
})

function ClassesListPage() {
  const { data: classes = [], isLoading, error } = useClasses()
  const deleteClass = useDeleteClass()
  const navigate = useNavigate()
  const { confirm, confirmDialog } = useConfirmDialog()
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('active')
  const filteredClasses = statusFilter === 'all'
    ? classes
    : classes.filter((classItem) => classItem.status === statusFilter)

  const handleDelete = async (id: string, name: string) => {
    if (await confirm({
      title: 'Delete class?',
      description: `Are you sure you want to delete "${name}"? This will also delete all its lessons.`,
      confirmText: 'Delete',
    })) {
      await deleteClass.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'name',
      header: 'Class Name',
      cell: ({ row }) => (
        <Link
          to="/classes/$classId"
          params={{ classId: row.original.id }}
          className="font-medium text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <Badge variant="secondary">{CLASS_LEVEL_LABELS[row.original.level]}</Badge>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-muted-foreground truncate max-w-xs">{row.original.description || '—'}</div>
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
            onClick={() => navigate({ to: '/classes/$classId/edit', params: { classId: row.original.id } })}
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
          Error loading classes: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Classes</h1>
        <p className="text-muted-foreground mt-1">{filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading classes...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={filteredClasses}
              searchColumn="name"
              searchPlaceholder="Search classes..."
              toolbarContent={(
                <>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as Status | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{STATUS_LABELS.active}</SelectItem>
                      <SelectItem value="inactive">{STATUS_LABELS.inactive}</SelectItem>
                      <SelectItem value="suspended">{STATUS_LABELS.suspended}</SelectItem>
                      <SelectItem value="all">All statuses</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button asChild>
                    <Link to="/classes/new">
                      <Plus className="h-4 w-4" />
                      Add New Class
                    </Link>
                  </Button>
                </>
              )}
            />
          </CardContent>
        </Card>
      )}
      {confirmDialog}
    </div>
  )
}
