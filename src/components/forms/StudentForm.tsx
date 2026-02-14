import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents'
import { CreateStudentSchema, UpdateStudentSchema, type Student } from '@/types/entities'
import { ENGLISH_LEVEL_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'

interface StudentFormProps {
  student?: Student
  mode: 'create' | 'edit'
}

export function StudentForm({ student, mode }: StudentFormProps) {
  const navigate = useNavigate()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  const form = useForm({
    defaultValues: {
      firstName: student?.firstName ?? '',
      lastName: student?.lastName ?? '',
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
        const submitData = {
          ...value,
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
            onChange: CreateStudentSchema.shape.firstName,
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
            onChange: CreateStudentSchema.shape.lastName,
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

        {/* Parent ID */}
        <form.Field name="parentId">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent ID
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Optional - Link to parent record"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the parent's ID to link this student to a parent
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
          disabled={form.state.isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Student' : 'Update Student'}
        </button>
      </div>
    </form>
  )
}
