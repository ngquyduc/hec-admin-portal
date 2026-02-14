import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateTeacher, useUpdateTeacher } from '@/hooks/useTeachers'
import { CreateTeacherSchema, UpdateTeacherSchema, type Teacher } from '@/types/entities'
import { SUBJECT_LABELS } from '@/lib/constants'
import { ArrowLeft, X } from 'lucide-react'
import { useState } from 'react'

interface TeacherFormProps {
  teacher?: Teacher
  mode: 'create' | 'edit'
}

export function TeacherForm({ teacher, mode }: TeacherFormProps) {
  const navigate = useNavigate()
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(teacher?.subjects ?? [])

  const form = useForm({
    defaultValues: {
      firstName: teacher?.firstName ?? '',
      lastName: teacher?.lastName ?? '',
      email: teacher?.email ?? '',
      phone: teacher?.phone ?? '',
      subjects: teacher?.subjects ?? [],
      hireDate: (typeof teacher?.hireDate === 'string' ? teacher.hireDate : teacher?.hireDate ? new Date(teacher.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      hourlyRate: teacher?.hourlyRate ?? 0,
      status: teacher?.status ?? ('active' as const),
      address: teacher?.address ?? '',
      emergencyContact: teacher?.emergencyContact ?? '',
      qualifications: teacher?.qualifications ?? '',
      notes: teacher?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = { ...value, subjects: selectedSubjects }
        
        if (mode === 'create') {
          const validated = CreateTeacherSchema.parse(submitData)
          await createTeacher.mutateAsync(validated)
        } else if (teacher) {
          const validated = UpdateTeacherSchema.parse(submitData)
          await updateTeacher.mutateAsync({ id: teacher.id, data: validated })
        }
        navigate({ to: '/teachers' })
      } catch (error) {
        console.error('Form submission error:', error)
      }
    },
  })

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

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
            onChange: CreateTeacherSchema.shape.firstName,
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
            onChange: CreateTeacherSchema.shape.lastName,
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
            onChange: CreateTeacherSchema.shape.email,
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
            onChange: CreateTeacherSchema.shape.phone,
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

        {/* Subjects - Multi-select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleSubject(value)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  selectedSubjects.includes(value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                >
                  {SUBJECT_LABELS[subject as keyof typeof SUBJECT_LABELS]}
                  <button
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {selectedSubjects.length === 0 && (
            <p className="mt-1 text-sm text-red-600">At least one subject is required</p>
          )}
        </div>

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

        {/* Hourly Rate */}
        <form.Field
          name="hourlyRate"
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={field.state.value}
                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
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

        {/* Qualifications */}
        <form.Field name="qualifications">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={2}
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
          onClick={() => navigate({ to: '/teachers' })}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={form.state.isSubmitting || selectedSubjects.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Teacher' : 'Update Teacher'}
        </button>
      </div>
    </form>
  )
}
