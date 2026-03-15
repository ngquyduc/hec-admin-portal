import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { EntryTestForm } from '@/components/forms/EntryTestForm'
import { useEntryTestById } from '@/hooks/useEntryTests'

export const Route = createFileRoute('/_authenticated/_admin/entry-tests/$entryTestId/edit')({
  component: EditEntryTestPage,
})

function EditEntryTestPage() {
  const { entryTestId } = Route.useParams()
  const { data: entryTest, isLoading, error } = useEntryTestById(entryTestId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading entry test record...
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !entryTest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Error loading entry test record: {error?.message || 'Record not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Entry Test Result</h1>
        <p className="text-muted-foreground mt-1">Update {entryTest.name}&apos;s pre-enrollment assessment</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <EntryTestForm mode="edit" entryTest={entryTest} />
        </CardContent>
      </Card>
    </div>
  )
}
