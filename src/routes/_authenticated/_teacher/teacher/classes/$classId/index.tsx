import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useLessonsByClass } from '@/hooks/useLessons'
import { useClassAssessments } from '@/hooks/useGrades'
import { useStudents } from '@/hooks/useStudents'
import { useCurrentUser } from '@/hooks/useAuth'
import { CLASS_LEVEL_LABELS, STATUS_COLORS, STATUS_LABELS, LESSON_STATUS_LABELS, LESSON_STATUS_COLORS, ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import { ArrowLeft, Plus, ClipboardList, Star, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_teacher/teacher/classes/$classId/')({
  component: TeacherClassDetail,
})

function TeacherClassDetail() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()

  const { data: cls, isLoading } = useClassById(classId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: lessons = [] } = useLessonsByClass(classId)
  const { data: assessments = [] } = useClassAssessments(classId)

  if (isLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (!cls) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Class not found.
        </div>
      </div>
    )
  }

  // Only the assigned teacher or assistant can view
  const isAuthorized =
    !!user?.teacherId &&
    (
      cls.mainTeacherIds.includes(user.teacherId) ||
      cls.teachingAssistantIds.includes(user.teacherId)
    )
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Access denied. You are not assigned to this class.
        </div>
      </div>
    )
  }

  const enrolledIds = new Set(enrolledLinks.map((l) => l.studentId))
  const enrolledStudents = allStudents.filter((s) => enrolledIds.has(s.id))

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/teacher' })} className="mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to My Classes
        </Button>
        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{cls.name}</h1>
              <div className="flex items-center gap-2">
                <Badge className={STATUS_COLORS[cls.status]}>
                  {STATUS_LABELS[cls.status]}
                </Badge>
                <Badge variant="secondary">
                  {CLASS_LEVEL_LABELS[cls.level]}
                </Badge>
              </div>
              {cls.description && (
                <p className="text-muted-foreground text-sm mt-2">{cls.description}</p>
              )}
            </div>
            <Button variant="outline" asChild>
              <Link to="/teacher/classes/$classId/grades" params={{ classId }}>
                <Star className="h-4 w-4" /> Gradebook
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Students (read-only) */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Students ({enrolledStudents.length})
          </h2>
          {enrolledStudents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No students enrolled.</p>
          ) : (
            <ul className="divide-y">
              {enrolledStudents.map((s) => (
                <li key={s.id} className="py-2 flex items-center gap-3">
                  <span className="font-medium">{s.name}</span>
                  {s.phone && <span className="text-sm text-muted-foreground">{s.phone}</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Assignments ({assessments.length})
            </h2>
            <Button asChild size="sm">
              <Link to="/teacher/classes/$classId/assignments/new" params={{ classId }}>
                <Plus className="h-4 w-4" /> Add Assignment
              </Link>
            </Button>
          </div>

          {assessments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assignments yet.</p>
          ) : (
            <ul className="divide-y">
              {assessments.map((assessment) => (
                <li key={assessment.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{assessment.title}</p>
                    <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Type: {ASSESSMENT_TYPE_LABELS[assessment.type]}</span>
                      <span>Max score: {assessment.maxScore}</span>
                      {assessment.dueAt && (
                        <span>Due: {new Date(assessment.dueAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      to="/teacher/classes/$classId/assignments/$assessmentId/grade"
                      params={{ classId, assessmentId: assessment.id }}
                    >
                      Grade
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Lessons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Lessons ({lessons.length})
            </h2>
            <Button asChild size="sm">
              <Link to="/teacher/classes/$classId/lessons/new" params={{ classId }}>
                <Plus className="h-4 w-4" /> Add Lesson
              </Link>
            </Button>
          </div>

          {lessons.length === 0 ? (
            <p className="text-muted-foreground text-sm">No lessons yet.</p>
          ) : (
            <ul className="divide-y">
              {lessons.map((lesson) => (
                <li key={lesson.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{lesson.title}</span>
                    <Badge className={`ml-2 ${LESSON_STATUS_COLORS[lesson.status]}`}>
                      {LESSON_STATUS_LABELS[lesson.status]}
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(lesson.startTime).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: '/teacher/classes/$classId/lessons/$lessonId/attendance',
                          params: { classId, lessonId: lesson.id },
                        })
                      }
                    >
                      <ClipboardList className="h-3.5 w-3.5" /> Attendance
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        navigate({
                          to: '/teacher/classes/$classId/lessons/$lessonId/edit',
                          params: { classId, lessonId: lesson.id },
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
