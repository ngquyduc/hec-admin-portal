import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateLesson, useUpdateLesson } from '@/hooks/useLessons'
import { CreateLessonSchema, UpdateLessonSchema, type Lesson } from '@/types/entities'
import { LESSON_STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface LessonFormProps {
  classId: string
  lesson?: Lesson
  mode: 'create' | 'edit'
}

export function LessonForm({ classId, lesson, mode }: LessonFormProps) {
  const navigate = useNavigate()
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()

  const toDatetimeLocal = (iso: string) => {
    if (!iso) return ''
    // Convert to local datetime-local format (YYYY-MM-DDTHH:MM)
    return new Date(iso).toISOString().slice(0, 16)
  }

  const form = useForm({
    defaultValues: {
      title: lesson?.title ?? '',
      content: lesson?.content ?? '',
      startTime: lesson ? toDatetimeLocal(lesson.startTime) : '',
      endTime: lesson ? toDatetimeLocal(lesson.endTime) : '',
      status: lesson?.status ?? ('scheduled' as const),
      notes: lesson?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = {
          classId,
          title: value.title,
          content: value.content || undefined,
          startTime: new Date(value.startTime).toISOString(),
          endTime: new Date(value.endTime).toISOString(),
          status: mode === 'create' ? ('scheduled' as const) : value.status,
          notes: value.notes || undefined,
        }

        if (mode === 'create') {
          const validated = CreateLessonSchema.parse(submitData)
          await createLesson.mutateAsync(validated)
        } else if (lesson) {
          const validated = UpdateLessonSchema.parse(submitData)
          await updateLesson.mutateAsync({ id: lesson.id, data: validated })
        }

        navigate({ to: '/classes/$classId', params: { classId } })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to save lesson. Please try again.')
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
        {/* Title */}
        <form.Field name="title">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Lesson 1 — Introduction to IELTS Writing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Start Time */}
        <form.Field name="startTime">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form.Field>

        {/* End Time */}
        <form.Field name="endTime">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                  {Object.entries(LESSON_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm">
              Scheduled
            </div>
          </div>
        )}

        {/* Content */}
        <form.Field name="content">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Content
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                placeholder="Topics covered, materials used, homework assigned..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </form.Field>

        {/* Notes */}
        <form.Field name="notes">
          {(field) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={2}
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
          onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
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
              ? 'Create Lesson'
              : 'Save Lesson'}
        </button>
      </div>
    </form>
  )
}
