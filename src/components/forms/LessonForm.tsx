import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateLesson, useUpdateLesson } from '@/hooks/useLessons'
import { useClasses } from '@/hooks/useClasses'
import { CreateLessonSchema, UpdateLessonSchema, type Class, type Lesson, type LessonStatus } from '@/types/entities'
import { LESSON_STATUS_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LessonFormProps {
  classId?: string
  lesson?: Lesson
  mode: 'create' | 'edit'
  onSuccess?: () => void
  onCancel?: () => void
  allowClassSelection?: boolean
}

export function LessonForm({ classId, lesson, mode, onSuccess, onCancel, allowClassSelection = false }: LessonFormProps) {
  const navigate = useNavigate()
  const { data: classes = [] } = useClasses()
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const [selectedClassId, setSelectedClassId] = useState('')
  const canSelectClass = mode === 'create' && allowClassSelection

  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  )

  const selectedClass = useMemo(
    () => classes.find((cls) => cls.id === selectedClassId),
    [classes, selectedClassId],
  )

  useEffect(() => {
    if (!canSelectClass) {
      setSelectedClassId(classId ?? '')
      return
    }
  }, [canSelectClass, classId])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
      return
    }

    if (mode === 'edit' && window.history.length > 1) {
      window.history.back()
      return
    }

    const targetClassId = canSelectClass ? selectedClassId : classId
    if (targetClassId) {
      navigate({ to: '/classes/$classId', params: { classId: targetClassId } })
      return
    }

    navigate({ to: '/lessons' })
  }

  const toDateLocal = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return ''
    const offsetInMs = date.getTimezoneOffset() * 60_000
    return new Date(date.getTime() - offsetInMs).toISOString().slice(0, 10)
  }

  const toTimeLocal = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return ''
    const offsetInMs = date.getTimezoneOffset() * 60_000
    return new Date(date.getTime() - offsetInMs).toISOString().slice(11, 16)
  }

  const combineDateAndTime = (datePart: string, timePart: string) => {
    return new Date(`${datePart}T${timePart}:00`).toISOString()
  }

  const defaultStartDate = useMemo(() => toDateLocal(new Date()), [])
  const defaultStartClock = useMemo(() => toTimeLocal(new Date()), [])
  const defaultEndDate = useMemo(() => toDateLocal(new Date(Date.now() + 2 * 60 * 60 * 1000)), [])
  const defaultEndClock = useMemo(() => toTimeLocal(new Date(Date.now() + 2 * 60 * 60 * 1000)), [])

  const createStatusOptions: LessonStatus[] = ['scheduled', 'ongoing', 'completed']

  const form = useForm({
    defaultValues: {
      title: lesson?.title ?? '',
      content: lesson?.content ?? '',
      startDate: lesson ? toDateLocal(lesson.startTime) : defaultStartDate,
      startClock: lesson ? toTimeLocal(lesson.startTime) : defaultStartClock,
      endDate: lesson ? toDateLocal(lesson.endTime) : defaultEndDate,
      endClock: lesson ? toTimeLocal(lesson.endTime) : defaultEndClock,
      status: lesson?.status ?? ('scheduled' as const),
      notes: lesson?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const targetClassId = canSelectClass ? selectedClassId : classId
        if (!targetClassId) {
          toast.error('Please select a class.')
          return
        }

        if (!value.startDate || !value.startClock || !value.endDate || !value.endClock) {
          toast.error('Please select both date and time for start and end.')
          return
        }

        const submitData = {
          classId: targetClassId,
          title: value.title,
          content: value.content || undefined,
          startTime: combineDateAndTime(value.startDate, value.startClock),
          endTime: combineDateAndTime(value.endDate, value.endClock),
          status: value.status,
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
          navigate({ to: '/classes/$classId', params: { classId: targetClassId } })
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
        {/* Class (create mode for admin) */}
        {canSelectClass && (
          <div className="md:col-span-2 space-y-1.5">
            <Label>Class <span className="text-destructive">*</span></Label>
            <Combobox
              items={sortedClasses}
              value={selectedClass ?? null}
              onValueChange={(value) => {
                const selected = value as Class | null
                setSelectedClassId(selected?.id ?? '')
              }}
              itemToStringLabel={(item) => (item as Class).name}
              itemToStringValue={(item) => (item as Class).name}
            >
              <ComboboxInput placeholder="Search class by name..." />
              <ComboboxContent>
                <ComboboxEmpty>No classes found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => {
                    const classItem = item as Class
                    return (
                    <ComboboxItem key={classItem.id} value={classItem}>
                      {classItem.name}
                    </ComboboxItem>
                    )
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        )}

        {/* Title */}
        <form.Field name="title">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Lesson Title <span className="text-destructive">*</span></Label>
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

        {/* Start Date & Time */}
        <div className="space-y-1.5">
          <Label>Start Time <span className="text-destructive">*</span></Label>
          <div className="grid grid-cols-[1fr_120px] gap-2">
            <form.Field name="startDate">
              {(field) => (
                <DatePicker
                  value={field.state.value || undefined}
                  onChange={(value) => field.handleChange(value ?? '')}
                  placeholder="Pick start date"
                />
              )}
            </form.Field>
            <form.Field name="startClock">
              {(field) => (
                <Input
                  type="time"
                  step="60"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* End Date & Time */}
        <div className="space-y-1.5">
          <Label>End Time <span className="text-destructive">*</span></Label>
          <div className="grid grid-cols-[1fr_120px] gap-2">
            <form.Field name="endDate">
              {(field) => (
                <DatePicker
                  value={field.state.value || undefined}
                  onChange={(value) => field.handleChange(value ?? '')}
                  placeholder="Pick end date"
                />
              )}
            </form.Field>
            <form.Field name="endClock">
              {(field) => (
                <Input
                  type="time"
                  step="60"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* Status */}
        <form.Field name="status">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as LessonStatus)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(mode === 'create'
                    ? createStatusOptions.map((value) => [value, LESSON_STATUS_LABELS[value]] as const)
                    : (Object.entries(LESSON_STATUS_LABELS) as [LessonStatus, string][])
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Button type="button" variant="outline" onClick={handleCancel}>
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
