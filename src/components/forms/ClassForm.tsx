import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateClass, useUpdateClass } from '@/hooks/useClasses'
import { useTeachers, useTeachersSearch } from '@/hooks/useTeachers'
import { CreateClassSchema, UpdateClassSchema, type Class } from '@/types/entities'
import { ENGLISH_LEVEL_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ClassFormProps {
  classData?: Class
  mode: 'create' | 'edit'
}

function TeacherSelector({
  label,
  value,
  onChange,
  excludeId,
  optional,
}: {
  label: string
  value: string
  onChange: (id: string, displayName: string) => void
  excludeId?: string
  optional?: boolean
}) {
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  const { data: allTeachers = [] } = useTeachers()
  const { data: searchedTeachers = [] } = useTeachersSearch(search)
  const pool = (search.length > 0 ? searchedTeachers : allTeachers).filter(
    (t) => t.id !== excludeId,
  )

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>

      {value ? (
        <div className="mb-1 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
          <span>{selectedLabel || value}</span>
          <button
            type="button"
            onClick={() => {
              onChange('', '')
              setSelectedLabel('')
              setSearch('')
            }}
            className="text-blue-400 hover:text-blue-600 font-bold leading-none"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Search by teacher name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {pool.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No teachers found</div>
              ) : (
                pool.map((teacher) => (
                  <button
                    key={teacher.id}
                    type="button"
                    onMouseDown={() => {
                      const label = `${teacher.name}${teacher.phone ? ` — ${teacher.phone}` : ''}`
                      setSelectedLabel(label)
                      onChange(teacher.id, label)
                      setSearch('')
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{teacher.name}</span>
                    {teacher.phone && (
                      <span className="ml-2 text-gray-500">{teacher.phone}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ClassForm({ classData, mode }: ClassFormProps) {
  const navigate = useNavigate()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()

  const form = useForm({
    defaultValues: {
      name: classData?.name ?? '',
      description: classData?.description ?? '',
      teacherId: classData?.teacherId ?? '',
      assistantId: classData?.assistantId ?? '',
      level: classData?.level ?? ('beginner' as const),
      status: classData?.status ?? ('active' as const),
      notes: classData?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = {
          ...value,
          status: mode === 'create' ? ('active' as const) : value.status,
          assistantId: value.assistantId || undefined,
          description: value.description || undefined,
          notes: value.notes || undefined,
        }

        if (mode === 'create') {
          const validated = CreateClassSchema.parse(submitData)
          await createClass.mutateAsync(validated)
        } else if (classData) {
          const validated = UpdateClassSchema.parse(submitData)
          await updateClass.mutateAsync({ id: classData.id, data: validated })
        }
        navigate({ to: '/classes' })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to save class. Please try again.')
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <form.Field name="name">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. IELTS Band 6 — Morning"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Level */}
        <form.Field name="level">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ENGLISH_LEVEL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form.Field>

        {/* Teacher */}
        <form.Field name="teacherId">
          {(field) => (
            <TeacherSelector
              label="Main Teacher"
              value={field.state.value}
              onChange={(id, _label) => {
                field.handleChange(id)
              }}
            />
          )}
        </form.Field>

        {/* Assistant */}
        <form.Field name="assistantId">
          {(field) => (
            <form.Field name="teacherId">
              {(teacherField) => (
                <TeacherSelector
                  label="Teaching Assistant"
                  value={field.state.value}
                  onChange={(id, _label) => {
                    field.handleChange(id)
                  }}
                  excludeId={teacherField.state.value || undefined}
                  optional
                />
              )}
            </form.Field>
          )}
        </form.Field>

        {/* Status — edit mode only */}
        {mode === 'edit' ? (
          <form.Field name="status">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}
          </form.Field>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm">
              Active
            </div>
            <p className="mt-1 text-xs text-gray-400">New classes are always set to Active</p>
          </div>
        )}

        {/* Notes */}
        <form.Field name="notes">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate({ to: '/classes' })}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={form.state.isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.state.isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Class'
              : 'Update Class'}
        </button>
      </div>
    </form>
  )
}
