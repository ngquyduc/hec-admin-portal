import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useStaff, useDeleteStaff } from '@/hooks/useStaff'
import { DataTable } from '@/components/DataTable'
import type { Staff } from '@/types/entities'
import { STAFF_ROLE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

export const Route = createFileRoute('/staff/')({
  component: StaffListPage,
})

function StaffListPage() {
  const { data: staff = [], isLoading, error } = useStaff()
  const deleteStaff = useDeleteStaff()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteStaff.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Staff>[] = [
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
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div className="text-gray-700">
          {STAFF_ROLE_LABELS[row.original.role]}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            STATUS_COLORS[row.original.status]
          }`}
        >
          {STATUS_LABELS[row.original.status]}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: '/staff/$staffId/edit', params: { staffId: row.original.id } })}
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
          Error loading staff: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <Link
          to="/staff/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Staff
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading staff...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={staff}
            searchColumn="firstName"
            searchPlaceholder="Search by first name..."
          />
        </div>
      )}
    </div>
  )
}
