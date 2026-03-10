import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { useClasses, useDeleteClass } from '@/hooks/useClasses'
import { DataTable } from '@/components/DataTable'
import type { Class } from '@/types/entities'
import { ENGLISH_LEVEL_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

export const Route = createFileRoute('/classes/')({
  component: ClassesListPage,
})

function ClassesListPage() {
  const { data: classes = [], isLoading, error } = useClasses()
  const deleteClass = useDeleteClass()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This will also delete all its lessons.`)) {
      await deleteClass.mutateAsync(id)
    }
  }

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'name',
      header: 'Class Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
          {ENGLISH_LEVEL_LABELS[row.original.level]}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-gray-600 truncate max-w-xs">{row.original.description || '—'}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded font-medium ${STATUS_COLORS[row.original.status]}`}>
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
            onClick={() => navigate({ to: '/classes/$classId', params: { classId: row.original.id } })}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate({ to: '/classes/$classId/edit', params: { classId: row.original.id } })}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id, row.original.name)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
          Error loading classes: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">{classes.length} class{classes.length !== 1 ? 'es' : ''}</p>
        </div>
        <Link
          to="/classes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Class
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-500">Loading classes...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <DataTable
            columns={columns}
            data={classes}
            searchColumn="name"
            searchPlaceholder="Search classes..."
          />
        </div>
      )}
    </div>
  )
}
