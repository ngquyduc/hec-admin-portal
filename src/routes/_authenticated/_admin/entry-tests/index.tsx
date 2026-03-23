import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDeleteEntryTest, useEntryTests } from '@/hooks/useEntryTests'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import type { EntryTestCandidate } from '@/types/entities'

export const Route = createFileRoute('/_authenticated/_admin/entry-tests/')({
  component: EntryTestsListPage,
})

const DECISION_VARIANT: Record<EntryTestCandidate['decisionStatus'], 'secondary' | 'default' | 'destructive'> = {
  pending: 'secondary',
  accepted: 'default',
  rejected: 'destructive',
}

const DECISION_LABEL: Record<EntryTestCandidate['decisionStatus'], string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

function EntryTestsListPage() {
  const { data: entryTests = [], isLoading, error } = useEntryTests()
  const deleteEntryTest = useDeleteEntryTest()
  const navigate = useNavigate()
  const { confirm, confirmDialog } = useConfirmDialog()

  const handleDelete = async (id: string, name: string) => {
    if (await confirm({
      title: 'Delete entry test?',
      description: `Are you sure you want to delete entry test for ${name}?`,
      confirmText: 'Delete',
    })) {
      await deleteEntryTest.mutateAsync(id)
    }
  }

  const columns: ColumnDef<EntryTestCandidate>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.phone}</div>,
    },
    {
      accessorKey: 'testDate',
      header: 'Test Date',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {new Date(row.original.testDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'decisionStatus',
      header: 'Decision',
      cell: ({ row }) => (
        <Badge variant={DECISION_VARIANT[row.original.decisionStatus]}>
          {DECISION_LABEL[row.original.decisionStatus]}
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
            onClick={() =>
              navigate({
                to: '/entry-tests/$entryTestId/edit',
                params: { entryTestId: row.original.id },
              })
            }
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
          Error loading entry tests: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Entry Tests</h1>
          <p className="text-muted-foreground mt-1">Track test results before student enrollment confirmation</p>
        </div>
        <Button asChild>
          <Link to="/entry-tests/new">
            <Plus className="h-4 w-4" />
            Add Entry Test
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">Loading entry tests...</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={entryTests}
              searchColumn="name"
              searchPlaceholder="Search by candidate name..."
            />
          </CardContent>
        </Card>
      )}
      {confirmDialog}
    </div>
  )
}
