import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateParent, useUpdateParent } from '@/hooks/useParents'
import { CreateParentSchema, UpdateParentSchema, type Parent } from '@/types/entities'
import { RELATIONSHIP_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

interface ParentFormProps {
  parent?: Parent
  mode: 'create' | 'edit'
}

export function ParentForm({ parent, mode }: ParentFormProps) {
  const navigate = useNavigate()
  const createParent = useCreateParent()
  const updateParent = useUpdateParent()

  const form = useForm({
    defaultValues: {
      name: parent?.name ?? '',
      email: parent?.email ?? '',
      phone: parent?.phone ?? '',
      relationship: parent?.relationship ?? ('mother' as const),
      occupation: parent?.occupation ?? '',
      address: parent?.address ?? '',
      notes: parent?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'create') {
          const validated = CreateParentSchema.parse(value)
          await createParent.mutateAsync(validated)
        } else if (parent) {
          const validated = UpdateParentSchema.parse(value)
          await updateParent.mutateAsync({ id: parent.id, data: validated })
        }
        navigate({ to: '/parents' })
      } catch (error) {
        console.error('Form submission error:', error)
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
            onChange: CreateParentSchema.shape.name,
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
        <form.Field
          name="email"
          validators={undefined}
        >
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
        <form.Field
          name="phone"
          validators={{
            onChange: CreateParentSchema.shape.phone,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
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

        {/* Relationship */}
        <form.Field
          name="relationship"
          validators={{
            onChange: CreateParentSchema.shape.relationship,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship <span className="text-red-500">*</span>
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
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

        {/* Occupation */}
        <form.Field name="occupation">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
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

        {/* Address */}
        <form.Field name="address">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Address
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
          onClick={() => navigate({ to: '/parents' })}
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
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Parent' : 'Update Parent'}
        </button>
      </div>
    </form>
  )
}
