import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          HEC Admin Portal
        </h1>
        <p className="text-xl text-muted-foreground">
          English Tutoring Center Management System
        </p>
      </div>
    </div>
  )
}
