import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useTeachers, useDeleteTeacher } from '@/hooks/useTeachers'
import { DataTable } from '@/components/DataTable'
import type { Teacher } from '@/types/entities'
import { SUBJECT_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

export const Route = createFileRoute('/teachers/')({
  component: TeachersListPage,
})

function TeachersListPage() {
  const { data: teachers = [], isLoading, error } = useTeachers()
  const deleteTeacher = useDeleteTeacher()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteTeacher.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Teacher>[] = [
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
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {SUBJECT_LABELS[subject]}
            </span>
          ))}
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
            onClick={() => navigate({ to: '/teachers/$teacherId/edit', params: { teacherId: row.original.id } })}
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
          Error loading teachers: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
        <Link
          to="/teachers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Teacher
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading teachers...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={teachers}
            searchColumn="firstName"
            searchPlaceholder="Search by first name..."
          />
        </div>
      )}
    </div>
  )
}
