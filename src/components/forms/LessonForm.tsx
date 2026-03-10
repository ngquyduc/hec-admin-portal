import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateLesson, useUpdateLesson } from '@/hooks/useLessons'
import { CreateLessonSchema, UpdateLessonSchema, type Lesson } from '@/types/entities'
import { LESSON_STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LessonFormProps {
  classId: string
  lesson?: Lesson
  mode: 'create' | 'edit'
  onSuccess?: () => void
}

export function LessonForm({ classId, lesson, mode, onSuccess }: LessonFormProps) {
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

        if (onSuccess) {
          onSuccess()
        } else {
          navigate({ to: '/classes/$classId', params: { classId } })
        }
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
            <div className="md:col-span-2 space-y-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Lesson 1 — Introduction to IELTS Writing"
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Start Time */}
        <form.Field name="startTime">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Start Time <span className="text-destructive">*</span></Label>
              <Input
                type="datetime-local"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        {/* End Time */}
        <form.Field name="endTime">
          {(field) => (
            <div className="space-y-1.5">
              <Label>End Time <span className="text-destructive">*</span></Label>
              <Input
                type="datetime-local"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        {/* Status — edit mode only */}
        {mode === 'edit' ? (
          <form.Field name="status">
            {(field) => (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(LESSON_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        ) : (
          <div className="space-y-1.5">
            <Label>Status</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
              Scheduled
            </div>
          </div>
        )}

        {/* Content */}
        <form.Field name="content">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Lesson Content</Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                placeholder="Topics covered, materials used, homework assigned..."
              />
            </div>
          )}
        </form.Field>

        {/* Notes */}
        <form.Field name="notes">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={2}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Lesson' : 'Save Lesson'}
        </Button>
      </div>
    </form>
  )
}
