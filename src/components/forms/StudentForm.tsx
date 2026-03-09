import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents'
import { useParents, useParentsSearch } from '@/hooks/useParents'
import { CreateStudentSchema, UpdateStudentSchema, type Student } from '@/types/entities'
import { ENGLISH_LEVEL_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface StudentFormProps {
  student?: Student
  mode: 'create' | 'edit'
}

export function StudentForm({ student, mode }: StudentFormProps) {
  const navigate = useNavigate()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  const [parentSearch, setParentSearch] = useState('')
  const [showParentDropdown, setShowParentDropdown] = useState(false)
  const [selectedParentLabel, setSelectedParentLabel] = useState<string>(() => {
    return student?.parentId ? '' : ''
  })

  const { data: allParents = [] } = useParents()
  const { data: searchedParents = [] } = useParentsSearch(parentSearch)
  const parentsToShow = parentSearch.length > 0 ? searchedParents : allParents

  const form = useForm({
    defaultValues: {
      name: student?.name ?? '',
      email: student?.email ?? '',
      phone: student?.phone ?? '',
      dateOfBirth: (typeof student?.dateOfBirth === 'string' ? student.dateOfBirth : student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''),
      englishLevel: student?.level ?? ('beginner' as const),
      enrollmentDate: (typeof student?.enrollmentDate === 'string' ? student.enrollmentDate : student?.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      status: student?.status ?? ('active' as const),
      address: student?.address ?? '',
      parentId: student?.parentId ?? '',
      notes: student?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { englishLevel, ...rest } = value
        const submitData = {
          ...rest,
          level: englishLevel,
          status: mode === 'create' ? ('active' as const) : value.status,
          parentId: value.parentId || null,
        }
        
        if (mode === 'create') {
          const validated = CreateStudentSchema.parse(submitData)
          await createStudent.mutateAsync(validated)
        } else if (student) {
          const validated = UpdateStudentSchema.parse(submitData)
          await updateStudent.mutateAsync({ id: student.id, data: validated })
        }
        navigate({ to: '/students' })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to save student. Please try again.')
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
        <form.Field
          name="name"
          validators={{
            onChange: CreateStudentSchema.shape.name,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Phone */}
        <form.Field name="phone">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Date of Birth */}
        <form.Field name="dateOfBirth">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* English Level */}
        <form.Field name="englishLevel">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                English Level <span className="text-red-500">*</span>
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(ENGLISH_LEVEL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Enrollment Date */}
        <form.Field name="enrollmentDate">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Status — only editable in edit mode */}
        {mode === 'edit' ? (
          <form.Field name="status">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
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
            <p className="mt-1 text-xs text-gray-400">New students are always set to Active</p>
          </div>
        )}

        {/* Address */}
        <form.Field name="address">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form.Field>

        {/* Parent Selector */}
        <form.Field name="parentId">
          {(field) => (
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent / Guardian
              </label>

              {/* Selected parent badge */}
              {field.state.value && (
                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                  <span>{selectedParentLabel || field.state.value}</span>
                  <button
                    type="button"
                    onClick={() => {
                      field.handleChange('')
                      setSelectedParentLabel('')
                      setParentSearch('')
                    }}
                    className="text-blue-400 hover:text-blue-600 font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Search input — hidden once a parent is selected */}
              {!field.state.value && (
                <div className="relative">
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={(e) => {
                      setParentSearch(e.target.value)
                      setShowParentDropdown(true)
                    }}
                    onFocus={() => setShowParentDropdown(true)}
                    onBlur={() => setTimeout(() => setShowParentDropdown(false), 150)}
                    placeholder="Search by name or phone number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {showParentDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {parentsToShow.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No parents found</div>
                      ) : (
                        parentsToShow.map((parent) => (
                          <button
                            key={parent.id}
                            type="button"
                            onMouseDown={() => {
                              field.handleChange(parent.id)
                              setSelectedParentLabel(`${parent.name}${parent.phone ? ` — ${parent.phone}` : ''}`)
                              setParentSearch('')
                              setShowParentDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900">{parent.name}</span>
                            {parent.phone && (
                              <span className="ml-2 text-gray-500">{parent.phone}</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Search and select a parent to link this student
              </p>
            </div>
          )}
        </form.Field>

        {/* Notes */}
        <form.Field name="notes">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
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

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate({ to: '/students' })}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={!form.state.canSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Student' : 'Update Student'}
        </button>
      </div>
    </form>
  )
}
