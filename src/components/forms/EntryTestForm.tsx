import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateEntryTest, useUpdateEntryTest } from '@/hooks/useEntryTests'
import { ENGLISH_LEVEL_LABELS } from '@/lib/constants'
import {
  CreateEntryTestCandidateSchema,
  UpdateEntryTestCandidateSchema,
  type EntryTestCandidate,
} from '@/types/entities'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ZodError } from 'zod'

const DECISION_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
} as const

interface EntryTestFormProps {
  entryTest?: EntryTestCandidate
  mode: 'create' | 'edit'
}

function getFieldErrorMessage(errors: unknown[] | undefined): string {
  if (!errors?.length) return ''

  return errors
    .map((error) => {
      if (typeof error === 'string') return error
      if (error instanceof Error) return error.message

      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === 'string') return message
      }

      const fallback = String(error)
      return fallback === '[object Object]' ? 'Invalid value' : fallback
    })
    .join(', ')
}

export function EntryTestForm({ entryTest, mode }: EntryTestFormProps) {
  const navigate = useNavigate()
  const createEntryTest = useCreateEntryTest()
  const updateEntryTest = useUpdateEntryTest()

  const handleCancel = () => {
    if (mode === 'edit' && window.history.length > 1) {
      window.history.back()
      return
    }
    navigate({ to: '/entry-tests' })
  }

  const form = useForm({
    defaultValues: {
      name: entryTest?.name ?? '',
      email: entryTest?.email ?? '',
      phone: entryTest?.phone ?? '',
      dateOfBirth:
        typeof entryTest?.dateOfBirth === 'string'
          ? entryTest.dateOfBirth
          : entryTest?.dateOfBirth
            ? new Date(entryTest.dateOfBirth).toISOString().split('T')[0]
            : '',
      testDate:
        typeof entryTest?.testDate === 'string'
          ? entryTest.testDate
          : entryTest?.testDate
            ? new Date(entryTest.testDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
      entryResult: entryTest?.entryResult ?? '',
      recommendedLevel: entryTest?.recommendedLevel ?? '',
      decisionStatus: entryTest?.decisionStatus ?? ('pending' as const),
      notes: entryTest?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = {
          ...value,
          email: value.email.trim() || undefined,
          dateOfBirth: value.dateOfBirth || undefined,
          recommendedLevel: value.recommendedLevel || undefined,
        }

        if (mode === 'create') {
          const validated = CreateEntryTestCandidateSchema.parse(submitData)
          await createEntryTest.mutateAsync(validated)
        } else if (entryTest) {
          const validated = UpdateEntryTestCandidateSchema.parse(submitData)
          await updateEntryTest.mutateAsync({ id: entryTest.id, data: validated })
        }

        navigate({ to: '/entry-tests' })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(
          error instanceof ZodError
            ? error.message
            : 'Failed to save entry test record. Please try again.',
        )
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
        <form.Field
          name="name"
          validators={{
            onChange: CreateEntryTestCandidateSchema.shape.name,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>}
            </div>
          )}
        </form.Field>

        <form.Field
          name="phone"
          validators={{
            onChange: CreateEntryTestCandidateSchema.shape.phone,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>}
            </div>
          )}
        </form.Field>

        <form.Field name="dateOfBirth">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <DatePicker
                value={field.state.value || undefined}
                onChange={(value) => field.handleChange(value ?? '')}
                placeholder="Pick date of birth"
                fromYear={1950}
                toYear={new Date().getFullYear()}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="testDate">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Test Date <span className="text-destructive">*</span></Label>
              <DatePicker
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? '')}
                fromYear={2000}
                toYear={new Date().getFullYear() + 1}
              />
              {field.state.meta.errors && <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>}
            </div>
          )}
        </form.Field>

        <form.Field
          name="recommendedLevel"
          validators={undefined}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Recommended Level</Label>
              <Select value={field.state.value || 'none'} onValueChange={(val) => field.handleChange(val === 'none' ? '' : val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not set</SelectItem>
                  {Object.entries(ENGLISH_LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field
          name="decisionStatus"
          validators={{
            onChange: CreateEntryTestCandidateSchema.shape.decisionStatus,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Enrollment Decision</Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DECISION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field
          name="entryResult"
          validators={{
            onChange: CreateEntryTestCandidateSchema.shape.entryResult,
          }}
        >
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Entry Test Result <span className="text-destructive">*</span></Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={4}
                placeholder="e.g. Reading: 18/30, Listening: 22/30, Speaking: Intermediate"
              />
              {field.state.meta.errors && <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>}
            </div>
          )}
        </form.Field>

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

      <div className="flex items-center gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={!form.state.canSubmit}>
          {form.state.isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Entry Test Record'
              : 'Update Entry Test Record'}
        </Button>
      </div>
    </form>
  )
}
