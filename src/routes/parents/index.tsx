import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useParents, useDeleteParent } from '@/hooks/useParents'
import { DataTable } from '@/components/DataTable'
import type { Parent } from '@/types/entities'
import { RELATIONSHIP_LABELS } from '@/lib/constants'

export const Route = createFileRoute('/parents/')({
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
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.firstName}</div>
      ),
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.lastName}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-gray-600">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-gray-600">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: 'relationship',
      header: 'Relationship',
      cell: ({ row }) => (
        <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
          {RELATIONSHIP_LABELS[row.original.relationship]}
        </span>
      ),
    },
    {
      accessorKey: 'studentIds',
      header: 'Students',
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.original.studentIds.length} student{row.original.studentIds.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: '/parents/$parentId/edit', params: { parentId: row.original.id } })}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id, `${row.original.firstName} ${row.original.lastName}`)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading parents: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
        <Link
          to="/parents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Parent
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading parents...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={parents}
            searchColumn="firstName"
            searchPlaceholder="Search by first name..."
          />
        </div>
      )}
    </div>
  )
}
