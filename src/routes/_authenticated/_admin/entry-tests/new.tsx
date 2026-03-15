import { createFileRoute } from '@tanstack/react-router'
import { EntryTestForm } from '@/components/forms/EntryTestForm'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/entry-tests/new')({
  component: NewEntryTestPage,
})

function NewEntryTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add Entry Test Result</h1>
        <p className="text-muted-foreground mt-1">Record a test result for a not-yet-enrolled candidate</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <EntryTestForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
