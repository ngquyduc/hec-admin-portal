import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ZodError } from 'zod'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/useAuth'
import { useCreateFeedback, useFeedbackByUserId } from '@/hooks/useFeedback'
import { CreateFeedbackSchema } from '@/types/entities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/feedback')({
  component: FeedbackPage,
})

function FeedbackPage() {
  const { data: user } = useCurrentUser()
  const createFeedback = useCreateFeedback()
  const { data: feedbackItems = [], isLoading: isLoadingFeedback } = useFeedbackByUserId(user?.id ?? '')

  const form = useForm({
    defaultValues: {
      title: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      if (!user) return

      try {
        const validated = CreateFeedbackSchema.parse({
          userId: user.id,
          userRole: user.role,
          title: value.title.trim(),
          message: value.message.trim(),
        })

        await createFeedback.mutateAsync(validated)
        form.reset()
        toast.success('Thanks for your feedback!')
      } catch (error) {
        toast.error(error instanceof ZodError ? error.issues[0]?.message ?? 'Invalid feedback data' : 'Failed to submit feedback')
      }
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mb-6">
        <CardHeader>
          <CardTitle>Feedback for Improvement</CardTitle>
          <CardDescription>Share suggestions to help us improve the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-5"
          >
            <form.Field name="title">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-title">Title</Label>
                  <Input
                    id="feedback-title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Short summary of your suggestion"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="message">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-message">Feedback</Label>
                  <Textarea
                    id="feedback-message"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Describe your idea or issue in detail"
                    rows={6}
                  />
                </div>
              )}
            </form.Field>

            <Button type="submit" disabled={createFeedback.isPending || !user}>
              {createFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Your Submitted Feedback</CardTitle>
          <CardDescription>Recent feedback submissions from your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFeedback ? (
            <p className="text-sm text-muted-foreground">Loading feedback...</p>
          ) : feedbackItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {feedbackItems.map((item) => (
                <div key={item.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
