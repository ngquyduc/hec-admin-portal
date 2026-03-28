import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff'
import { CreateStaffSchema, UpdateStaffSchema, type Staff } from '@/types/entities'
import { STAFF_ROLE_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
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

interface StaffFormProps {
  staff?: Staff
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

export function StaffForm({ staff, mode }: StaffFormProps) {
  const navigate = useNavigate()
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()

  const handleCancel = () => {
    if (mode === 'edit' && window.history.length > 1) {
      window.history.back()
      return
    }
    navigate({ to: '/staff' })
  }

  const form = useForm({
    defaultValues: {
      name: staff?.name ?? '',
      email: staff?.email ?? '',
      phone: staff?.phone ?? '',
      role: staff?.role ?? ('administrator' as const),
      hireDate:
        typeof staff?.hireDate === 'string'
          ? staff.hireDate
          : staff?.hireDate
            ? new Date(staff.hireDate).toISOString().split('T')[0]
            : '',
      status: staff?.status ?? ('active' as const),
      address: staff?.address ?? '',
      emergencyContact: staff?.emergencyContact ?? '',
      notes: staff?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        const submitData = {
          ...value,
          hireDate: value.hireDate || undefined,
        }

        if (mode === 'create') {
          const validated = CreateStaffSchema.parse(submitData)
          await createStaff.mutateAsync(validated)
        } else if (staff) {
          const validated = UpdateStaffSchema.parse(submitData)
          await updateStaff.mutateAsync({ id: staff.id, data: validated })
        }
        navigate({ to: '/staff' })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to save staff. Please try again.')
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
            onChange: CreateStaffSchema.shape.name,
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
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
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
            <div className="space-y-1.5">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
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
            <div className="space-y-1.5">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
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
            <div className="space-y-1.5">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Hire Date */}
        <form.Field
          name="hireDate"
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Hire Date</Label>
              <DatePicker
                value={field.state.value}
                onChange={(value) => field.handleChange(value ?? '')}
                fromYear={2000}
                toYear={new Date().getFullYear() + 2}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Status */}
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
        <form.Field
          name="emergencyContact"
          validators={{
            onChange: CreateStaffSchema.shape.emergencyContact.unwrap(),
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Emergency Contact</Label>
              <Input
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">{getFieldErrorMessage(field.state.meta.errors)}</p>
              )}
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
        <Button type="button" variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={!form.state.canSubmit}>
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Staff' : 'Update Staff'}
        </Button>
      </div>
    </form>
  )
}
