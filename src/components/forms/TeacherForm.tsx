import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateTeacher, useUpdateTeacher } from '@/hooks/useTeachers'
import { CreateTeacherSchema, UpdateTeacherSchema, type Teacher } from '@/types/entities'
import { SUBJECT_LABELS, TEACHER_ROLE_LABELS } from '@/lib/constants'
import { ArrowLeft, X } from 'lucide-react'
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
      name: teacher?.name ?? '',
      role: teacher?.role ?? ('main-teacher' as const),
      email: teacher?.email ?? '',
      phone: teacher?.phone ?? '',
      subjects: teacher?.subjects ?? [],
      hireDate: (typeof teacher?.hireDate === 'string' ? teacher.hireDate : teacher?.hireDate ? new Date(teacher.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      status: teacher?.status ?? ('active' as const),
      address: teacher?.address ?? '',
      emergencyContact: teacher?.emergencyContact ?? '',
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
        toast.error(error instanceof Error ? error.message : 'Failed to save teacher. Please try again.')
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
        {/* Name */}
        <form.Field
          name="name"
          validators={{
            onChange: CreateTeacherSchema.shape.name,
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
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Role */}
        <form.Field
          name="role"
          validators={{
            onChange: CreateTeacherSchema.shape.role,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEACHER_ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
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
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
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
            <div className="space-y-1.5">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Subjects - Multi-select */}
        <div className="md:col-span-2 space-y-2">
          <Label>Subjects <span className="text-destructive">*</span></Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleSubject(value)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  selectedSubjects.includes(value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input text-foreground hover:bg-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="gap-1">
                  {SUBJECT_LABELS[subject as keyof typeof SUBJECT_LABELS]}
                  <button
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {selectedSubjects.length === 0 && (
            <p className="text-sm text-destructive">At least one subject is required</p>
          )}
        </div>

        {/* Hire Date */}
        <form.Field
          name="hireDate"
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Hire Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Status (editable only on edit) */}
        {mode === 'edit' && (
          <form.Field name="status">
            {(field) => (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
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

        {/* Address */}
        <form.Field name="address">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Emergency Contact */}
        <form.Field name="emergencyContact">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Emergency Contact</Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
                rows={3}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => navigate({ to: '/teachers' })}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={!form.state.canSubmit || selectedSubjects.length === 0}>
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Teacher' : 'Update Teacher'}
        </Button>
      </div>
    </form>
  )
}
