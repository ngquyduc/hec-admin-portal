import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateClass, useUpdateClass } from '@/hooks/useClasses'
import { useTeachers, useTeachersSearch } from '@/hooks/useTeachers'
import { CreateClassSchema, UpdateClassSchema, type Class, type ClassLevel, type ClassType } from '@/types/entities'
import { CLASS_LEVEL_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ClassFormProps {
  classData?: Class
  mode: 'create' | 'edit'
}

const IELTS_LEVEL_OPTIONS: Array<{ value: ClassLevel; label: string }> = [
  { value: 'pre-ielts', label: CLASS_LEVEL_LABELS['pre-ielts'] },
  { value: '3.5-4.5', label: CLASS_LEVEL_LABELS['3.5-4.5'] },
  { value: '4.5-5.5', label: CLASS_LEVEL_LABELS['4.5-5.5'] },
  { value: '5.5-6.5', label: CLASS_LEVEL_LABELS['5.5-6.5'] },
  { value: '6.5-7.0+', label: CLASS_LEVEL_LABELS['6.5-7.0+'] },
]

const COMMUNICATION_LEVEL_OPTIONS: Array<{ value: ClassLevel; label: string }> = [
  { value: 'beginner', label: CLASS_LEVEL_LABELS.beginner },
  { value: 'elementary', label: CLASS_LEVEL_LABELS.elementary },
  { value: 'pre-intermediate', label: CLASS_LEVEL_LABELS['pre-intermediate'] },
  { value: 'intermediate', label: CLASS_LEVEL_LABELS.intermediate },
  { value: 'upper-intermediate', label: CLASS_LEVEL_LABELS['upper-intermediate'] },
]

const IELTS_LEVELS: ClassLevel[] = [
  'pre-ielts',
  '3.5-4.5',
  '4.5-5.5',
  '5.5-6.5',
  '6.5-7.0+',
]

function inferClassTypeFromLevel(level: ClassLevel): ClassType {
  return IELTS_LEVELS.includes(level) ? 'ielts' : 'communication-english'
}

function TeacherSelector({
  label,
  values,
  onChange,
  excludeIds = [],
}: {
  label: string
  values: string[]
  onChange: (ids: string[]) => void
  excludeIds?: string[]
}) {
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const { data: allTeachers = [] } = useTeachers()
  const { data: searchedTeachers = [] } = useTeachersSearch(search)

  const selectedTeachers = values
    .map((id) => allTeachers.find((teacher) => teacher.id === id))
    .filter((teacher): teacher is NonNullable<typeof teacher> => Boolean(teacher))

  const blockedTeacherIds = new Set([...excludeIds, ...values])
  const pool = (search.length > 0 ? searchedTeachers : allTeachers).filter(
    (teacher) => !blockedTeacherIds.has(teacher.id),
  )

  return (
    <div className="relative space-y-1.5">
      <Label>
        {label} <span className="text-destructive">*</span>
      </Label>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTeachers.map((teacher) => (
            <Badge key={teacher.id} variant="secondary" className="gap-2">
              {teacher.name}
              <button
                type="button"
                onClick={() => onChange(values.filter((id) => id !== teacher.id))}
                className="hover:text-destructive font-bold leading-none"
              >
                ×
              </button>
            </Badge>
          ))}
          {values
            .filter((id) => !selectedTeachers.some((teacher) => teacher.id === id))
            .map((id) => (
              <Badge key={id} variant="secondary" className="gap-2">
                {id}
                <button
                  type="button"
                  onClick={() => onChange(values.filter((valueId) => valueId !== id))}
                  className="hover:text-destructive font-bold leading-none"
                >
                  ×
                </button>
              </Badge>
            ))}
        </div>
      )}

      <div className="relative">
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Search by teacher name..."
        />
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {pool.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No teachers found</div>
            ) : (
              pool.map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onMouseDown={() => {
                    onChange([...values, teacher.id])
                    setSearch('')
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{teacher.name}</span>
                  {teacher.phone && (
                    <span className="ml-2 text-muted-foreground">{teacher.phone}</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ClassForm({ classData, mode }: ClassFormProps) {
  const navigate = useNavigate()
  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const [classType, setClassType] = useState<ClassType>(
    classData?.classType ?? inferClassTypeFromLevel(classData?.level ?? 'beginner'),
  )

  const handleCancel = () => {
    if (mode === 'edit' && window.history.length > 1) {
      window.history.back()
      return
    }
    navigate({ to: '/classes' })
  }

  const form = useForm({
    defaultValues: {
      name: classData?.name ?? '',
      description: classData?.description ?? '',
      mainTeacherIds: classData?.mainTeacherIds ?? [],
      teachingAssistantIds: classData?.teachingAssistantIds ?? [],
      level: classData?.level ?? (classType === 'ielts' ? 'pre-ielts' : 'beginner'),
      status: classData?.status ?? ('active' as const),
      notes: classData?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const allowedLevels = (classType === 'ielts' ? IELTS_LEVEL_OPTIONS : COMMUNICATION_LEVEL_OPTIONS)
          .map((option) => option.value)
        const normalizedLevel = allowedLevels.includes(value.level)
          ? value.level
          : allowedLevels[0]

        const submitData = {
          ...value,
          classType,
          level: normalizedLevel,
          status: mode === 'create' ? ('active' as const) : value.status,
          mainTeacherIds: [...new Set(value.mainTeacherIds)],
          teachingAssistantIds: [...new Set(value.teachingAssistantIds)],
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
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          (error as { code?: string }).code === '23514'
        ) {
          toast.error('Class type and level do not match. Please choose a valid level for the selected class type.')
          return
        }

        toast.error(error instanceof Error ? error.message : 'Failed to save class. Please try again.')
      }
    },
  })

  const levelOptions = classType === 'ielts' ? IELTS_LEVEL_OPTIONS : COMMUNICATION_LEVEL_OPTIONS

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
            <div className="space-y-1.5">
              <Label>Class Name <span className="text-destructive">*</span></Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. IELTS Band 6 — Morning"
              />
              {field.state.meta.errors?.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        <div className="space-y-1.5">
          <Label>Class Type <span className="text-destructive">*</span></Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={classType === 'ielts' ? 'default' : 'outline'}
              onClick={() => setClassType('ielts')}
            >
              IELTS
            </Button>
            <Button
              type="button"
              variant={classType === 'communication-english' ? 'default' : 'outline'}
              onClick={() => setClassType('communication-english')}
            >
              Communication
            </Button>
          </div>
        </div>

        {/* Level */}
        <form.Field name="level">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Level <span className="text-destructive">*</span></Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Main Teachers */}
        <form.Field name="mainTeacherIds">
          {(field) => (
            <form.Field name="teachingAssistantIds">
              {(assistantField) => (
                <div className="space-y-1.5">
                  <TeacherSelector
                    label="Main Teachers"
                    values={field.state.value}
                    onChange={(ids) => {
                      field.handleChange(ids)
                    }}
                    excludeIds={assistantField.state.value}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          )}
        </form.Field>

        {/* Teaching Assistants */}
        <form.Field name="teachingAssistantIds">
          {(field) => (
            <form.Field name="mainTeacherIds">
              {(mainTeacherField) => (
                <div className="space-y-1.5">
                <TeacherSelector
                  label="Teaching Assistants"
                  values={field.state.value}
                  onChange={(ids) => {
                    field.handleChange(ids)
                  }}
                  excludeIds={mainTeacherField.state.value}
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
                )}
                </div>
              )}
            </form.Field>
          )}
        </form.Field>

        {/* Status — edit mode only */}
        {mode === 'edit' && (
          <form.Field name="status">
            {(field) => (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        )}

        {/* Notes */}
        <form.Field name="notes">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
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
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Update Class'}
        </Button>
      </div>
    </form>
  )
}
