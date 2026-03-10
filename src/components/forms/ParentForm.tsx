import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useCreateParent, useUpdateParent } from '@/hooks/useParents'
import { CreateParentSchema, UpdateParentSchema, type Parent } from '@/types/entities'
import { RELATIONSHIP_LABELS } from '@/lib/constants'
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

interface ParentFormProps {
  parent?: Parent
  mode: 'create' | 'edit'
}

export function ParentForm({ parent, mode }: ParentFormProps) {
  const navigate = useNavigate()
  const createParent = useCreateParent()
  const updateParent = useUpdateParent()

  const form = useForm({
    defaultValues: {
      name: parent?.name ?? '',
      email: parent?.email ?? '',
      phone: parent?.phone ?? '',
      relationship: parent?.relationship ?? ('mother' as const),
      occupation: parent?.occupation ?? '',
      address: parent?.address ?? '',
      notes: parent?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'create') {
          const validated = CreateParentSchema.parse(value)
          await createParent.mutateAsync(validated)
        } else if (parent) {
          const validated = UpdateParentSchema.parse(value)
          await updateParent.mutateAsync({ id: parent.id, data: validated })
        }
        navigate({ to: '/parents' })
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to save parent. Please try again.')
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
            onChange: CreateParentSchema.shape.name,
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
        <form.Field
          name="email"
          validators={undefined}
        >
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
        <form.Field
          name="phone"
          validators={{
            onChange: CreateParentSchema.shape.phone,
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

        {/* Relationship */}
        <form.Field
          name="relationship"
          validators={{
            onChange: CreateParentSchema.shape.relationship,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label>Relationship <span className="text-destructive">*</span></Label>
              <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
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

        {/* Occupation */}
        <form.Field name="occupation">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Occupation</Label>
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Address */}
        <form.Field name="address">
          {(field) => (
            <div className="md:col-span-2 space-y-1.5">
              <Label>Home Address</Label>
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
        <Button type="button" variant="outline" onClick={() => navigate({ to: '/parents' })}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={!form.state.canSubmit}>
          {form.state.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Parent' : 'Update Parent'}
        </Button>
      </div>
    </form>
  )
}
