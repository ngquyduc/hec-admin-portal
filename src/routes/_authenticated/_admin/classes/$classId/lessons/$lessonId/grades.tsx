import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonById } from '@/hooks/useLessons'
import { useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useLessonAssessmentScores, useUpsertLessonAssessmentScores } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { AssessmentType } from '@/types/entities'
import { ArrowLeft, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/lessons/$lessonId/grades')({
  component: LessonGradesPage,
})

const ASSESSMENT_TYPES = Object.keys(ASSESSMENT_TYPE_LABELS) as AssessmentType[]

function LessonGradesPage() {
  const { classId, lessonId } = Route.useParams()
  const navigate = useNavigate()

  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useLessonById(lessonId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingScores = [], isLoading: gradesLoading } = useLessonAssessmentScores(classId, lessonId)
  const upsertScores = useUpsertLessonAssessmentScores()

  const [assessmentType, setAssessmentType] = useState<AssessmentType>('test')
  const [maxScore, setMaxScore] = useState<number>(10)
  // Map studentId → score string (empty = not graded)
  const [scores, setScores] = useState<Record<string, string>>({})

  const enrolledStudentIds = enrolledLinks.map((l) => l.studentId)
  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.includes(s.id))

  // Seed scores from existing records for the selected assessment type
  useEffect(() => {
    const seed: Record<string, string> = {}
    enrolledStudents.forEach((s) => {
      const found = existingScores.find(
        (g) => g.studentId === s.id && g.type === assessmentType,
      )
      if (found && found.score !== null) {
        seed[s.id] = String(found.score)
      }
    })
    setScores(seed)
    // Also sync maxScore from first existing record for this type
    const firstRecord = existingScores.find((g) => g.type === assessmentType)
    if (firstRecord) setMaxScore(firstRecord.maxScore)
  }, [enrolledStudents.length, existingScores.length, assessmentType])

  const gradedCount = Object.values(scores).filter((v) => v !== '').length

  const handleSubmit = async () => {
    const records = enrolledStudents.map((s) => ({
      studentId: s.id,
      score: scores[s.id] !== '' && scores[s.id] !== undefined ? Number(scores[s.id]) : null,
    }))

    try {
      const lessonTitle = lesson?.title ?? 'Assessment'
      await upsertScores.mutateAsync({
        classId,
        lessonId,
        type: assessmentType,
        title: `${lessonTitle} - ${ASSESSMENT_TYPE_LABELS[assessmentType]}`,
        maxScore,
        records,
      })
      toast.success('Scores saved successfully!')
      navigate({ to: '/classes/$classId', params: { classId } })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save scores. Please try again.')
    }
  }

  if (lessonLoading || gradesLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (lessonError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Lesson not found: {lessonError?.message}
        </div>
      </div>
    )
  }

  const totalCount = enrolledStudents.length

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm"
          type="button"
          onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class
        </Button>
        <div className="flex items-center gap-3">
          <Star className="h-7 w-7 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold">Grading</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Lesson info */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Start time: </span>
          <span className="font-medium">
            {new Date(lesson.startTime).toLocaleString('en-US')}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">End time: </span>
          <span className="font-medium">
            {new Date(lesson.endTime).toLocaleString('en-US')}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Class size: </span>
          <span className="font-medium">{totalCount} students</span>
        </div>
        </CardContent>
      </Card>

      {/* Assessment type and max score selector */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Assessment type</label>
          <div className="flex gap-2 flex-wrap">
            {ASSESSMENT_TYPES.map((type) => (
              <Button
                key={type}
                type="button"
                variant={assessmentType === type ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setAssessmentType(type)}
              >
                {ASSESSMENT_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max score</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
          />
        </div>
        <div className="text-sm text-muted-foreground">
           {gradedCount}/{totalCount} graded
        </div>
        </CardContent>
      </Card>

      {/* Grades table */}
      {totalCount === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
             No students in this class.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                 <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                   Score (/{maxScore})
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">%</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrolledStudents.map((student, index) => {
                const rawVal = scores[student.id]
                const numVal = rawVal !== '' && rawVal !== undefined ? Number(rawVal) : null
                const pct =
                  numVal !== null && maxScore > 0
                    ? Math.round((numVal / maxScore) * 100)
                    : null

                return (
                  <tr key={student.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      {student.name}
                      {student.phone && (
                        <span className="ml-2 text-xs text-muted-foreground">{student.phone}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={maxScore}
                        step={0.5}
                        value={rawVal ?? ''}
                        onChange={(e) =>
                          setScores((prev) => ({ ...prev, [student.id]: e.target.value }))
                        }
                        placeholder="—"
                        className="w-24 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {pct !== null ? (
                        <span
                          className={`font-medium ${
                            pct >= 80
                              ? 'text-green-600'
                              : pct >= 50
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {pct}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {totalCount > 0 && (
        <div className="flex items-center gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          >
            <ArrowLeft className="h-4 w-4" />
             Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={upsertScores.isPending}
          >
             {upsertScores.isPending ? 'Saving...' : 'Save scores'}
          </Button>
        </div>
      )}
    </div>
  )
}
