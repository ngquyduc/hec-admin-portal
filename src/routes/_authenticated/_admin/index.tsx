import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/')({ component: App })

function App() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Key insights will appear here as data is onboarded.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-48 w-full flex items-center justify-center text-muted-foreground">
            No dashboard metrics available yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
