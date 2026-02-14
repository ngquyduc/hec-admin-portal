import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff'
import { CreateStaffSchema, UpdateStaffSchema, type Staff } from '@/types/entities'
import { STAFF_ROLE_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

interface StaffFormProps {
  staff?: Staff
  mode: 'create' | 'edit'
}

export function StaffForm({ staff, mode }: StaffFormProps) {
  const navigate = useNavigate()
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()

  const form = useForm({
    defaultValues: {
      firstName: staff?.firstName ?? '',
      lastName: staff?.lastName ?? '',
      email: staff?.email ?? '',
      phone: staff?.phone ?? '',
      role: staff?.role ?? ('administrator' as const),
      hireDate: (typeof staff?.hireDate === 'string' ? staff.hireDate : staff?.hireDate ? new Date(staff.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      status: staff?.status ?? ('active' as const),
      address: staff?.address ?? '',
      emergencyContact: staff?.emergencyContact ?? '',
      notes: staff?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'create') {
          const validated = CreateStaffSchema.parse(value)
          await createStaff.mutateAsync(validated)
        } else if (staff) {
          const validated = UpdateStaffSchema.parse(value)
          await updateStaff.mutateAsync({ id: staff.id, data: validated })
        }
        navigate({ to: '/staff' })
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
        {/* First Name */}
        <form.Field
          name="firstName"
          validators={{
            onChange: CreateStaffSchema.shape.firstName,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
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

        {/* Last Name */}
        <form.Field
          name="lastName"
          validators={{
            onChange: CreateStaffSchema.shape.lastName,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
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
          validators={{
            onChange: CreateStaffSchema.shape.email,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
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
            onChange: CreateStaffSchema.shape.phone,
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

        {/* Role */}
        <form.Field
          name="role"
          validators={{
            onChange: CreateStaffSchema.shape.role,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
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

        {/* Hire Date */}
        <form.Field
          name="hireDate"
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date <span className="text-red-500">*</span>
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

        {/* Status */}
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

        {/* Emergency Contact */}
        <form.Field name="emergencyContact">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
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
          onClick={() => navigate({ to: '/staff' })}
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
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Staff' : 'Update Staff'}
        </button>
      </div>
    </form>
  )
}
