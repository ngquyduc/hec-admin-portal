import { createFileRoute, Link } from '@tanstack/react-router'
import { useCurrentUser } from '@/hooks/useAuth'
import { useClassesByTeacher } from '@/hooks/useClasses'
import { School, CalendarDays, ClipboardList } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/teacher/')({
  component: TeacherDashboard,
})

function TeacherDashboard() {
  const { data: user } = useCurrentUser()
  const { data: classes = [], isLoading } = useClassesByTeacher(user?.teacherId ?? '')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading your classes...</div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No classes have been assigned to you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              to="/teacher/classes/$classId"
              params={{ classId: cls.id }}
              className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow hover:border-primary/30"
            >
              <h3 className="text-lg font-semibold mb-2">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {cls.description ?? 'No description'}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Lessons
                </span>
                <span className="flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" /> Attendance
                </span>
                <span className="flex items-center gap-1">
                  <School className="h-3.5 w-3.5" /> Grades
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
