import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents'
import { useParents, useParentsSearch } from '@/hooks/useParents'
import { CreateStudentSchema, UpdateStudentSchema, type Student } from '@/types/entities'
import { ENGLISH_LEVEL_LABELS } from '@/lib/constants'
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

interface StudentFormProps {
  student?: Student
  mode: 'create' | 'edit'
}

export function StudentForm({ student, mode }: StudentFormProps) {
  const navigate = useNavigate()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  const [parentSearch, setParentSearch] = useState('')
  const [showParentDropdown, setShowParentDropdown] = useState(false)
  const [selectedParentLabel, setSelectedParentLabel] = useState<string>(() => {
    return student?.parentId ? '' : ''
  })

  const { data: allParents = [] } = useParents()
  const { data: searchedParents = [] } = useParentsSearch(parentSearch)
  const parentsToShow = parentSearch.length > 0 ? searchedParents : allParents

  const form = useForm({
    defaultValues: {
      name: student?.name ?? '',
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
        const { englishLevel, ...rest } = value
        const submitData = {
          ...rest,
          level: englishLevel,
          status: mode === 'create' ? ('active' as const) : value.status,
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
        toast.error(error instanceof Error ? error.message : 'Failed to save student. Please try again.')
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
            onChange: CreateStudentSchema.shape.name,
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

        {/* Email */}
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
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Phone */}
        <form.Field name="phone">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Phone</Label>
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

        {/* Date of Birth */}
        <form.Field name="dateOfBirth">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Date of Birth <span className="text-destructive">*</span></Label>
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

        {/* English Level */}
        <form.Field name="englishLevel">
          {(field) => (
            <div className="space-y-1.5">
              <Label>English Level <span className="text-destructive">*</span></Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ENGLISH_LEVEL_LABELS).map(([value, label]) => (
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

        {/* Enrollment Date */}
        <form.Field name="enrollmentDate">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Enrollment Date <span className="text-destructive">*</span></Label>
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

        {/* Status — only editable in edit mode */}
        {mode === 'edit' ? (
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
        ) : (
          <div className="space-y-1.5">
            <Label>Status</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
              Active
            </div>
            <p className="text-xs text-muted-foreground">New students are always set to Active</p>
          </div>
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

        {/* Parent Selector */}
        <form.Field name="parentId">
          {(field) => (
            <div className="md:col-span-2 relative space-y-1.5">
              <Label>Parent / Guardian</Label>

              {/* Selected parent badge */}
              {field.state.value && (
                <Badge variant="secondary" className="gap-2 mb-1">
                  {selectedParentLabel || field.state.value}
                  <button
                    type="button"
                    onClick={() => {
                      field.handleChange('')
                      setSelectedParentLabel('')
                      setParentSearch('')
                    }}
                    className="hover:text-destructive font-bold leading-none"
                  >
                    ×
                  </button>
                </Badge>
              )}

              {/* Search input — hidden once a parent is selected */}
              {!field.state.value && (
                <div className="relative">
                  <Input
                    type="text"
                    value={parentSearch}
                    onChange={(e) => {
                      setParentSearch(e.target.value)
                      setShowParentDropdown(true)
                    }}
                    onFocus={() => setShowParentDropdown(true)}
                    onBlur={() => setTimeout(() => setShowParentDropdown(false), 150)}
                    placeholder="Search by name or phone number..."
                  />

                  {showParentDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {parentsToShow.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground">No parents found</div>
                      ) : (
                        parentsToShow.map((parent) => (
                          <button
                            key={parent.id}
                            type="button"
                            onMouseDown={() => {
                              field.handleChange(parent.id)
                              setSelectedParentLabel(`${parent.name}${parent.phone ? ` — ${parent.phone}` : ''}`)
                              setParentSearch('')
                              setShowParentDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            <span className="font-medium">{parent.name}</span>
                            {parent.phone && (
                              <span className="ml-2 text-muted-foreground">{parent.phone}</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Search and select a parent to link this student
              </p>
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
        <Button type="button" variant="outline" onClick={() => navigate({ to: '/students' })}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={!form.state.canSubmit}>
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Student' : 'Update Student'}
        </Button>
      </div>
    </form>
  )
}
