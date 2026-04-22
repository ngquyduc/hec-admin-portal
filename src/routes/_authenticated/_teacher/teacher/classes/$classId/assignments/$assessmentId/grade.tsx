import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useCurrentUser } from '@/hooks/useAuth'
import {
  useAssessmentById,
  useAssessmentComponentScores,
  useAssessmentComponents,
  useAssessmentScores,
  useUpsertAssessmentComponentScoresByAssessmentId,
  useUpsertAssessmentScoresById,
} from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/_teacher/teacher/classes/$classId/assignments/$assessmentId/grade')({
  component: TeacherGradeAssignmentPage,
})

function TeacherGradeAssignmentPage() {
  const { classId, assessmentId } = Route.useParams()
  const navigate = useNavigate()

  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: cls, isLoading: classLoading } = useClassById(classId)
  const { data: assessment, isLoading: assessmentLoading, error: assessmentError } = useAssessmentById(assessmentId)
  const { data: existingScores = [], isLoading: scoresLoading } = useAssessmentScores(assessmentId)
  const { data: components = [], isLoading: componentsLoading } = useAssessmentComponents(assessmentId)
  const { data: componentScores = [], isLoading: componentScoresLoading } = useAssessmentComponentScores(assessmentId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const upsertScores = useUpsertAssessmentScoresById()
  const upsertComponentScores = useUpsertAssessmentComponentScoresByAssessmentId()

  const [scores, setScores] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [componentScoreInputs, setComponentScoreInputs] = useState<Record<string, string>>({})
  const [componentCommentInputs, setComponentCommentInputs] = useState<Record<string, string>>({})
  const [showOnlyUngraded, setShowOnlyUngraded] = useState(false)

  const enrolledIds = new Set(enrolledLinks.map((l) => l.studentId))
  const enrolledStudents = allStudents.filter((student) => enrolledIds.has(student.id))

  useEffect(() => {
    const scoreSeed: Record<string, string> = {}
    const commentSeed: Record<string, string> = {}

    existingScores.forEach((record) => {
      if (record.score !== null) scoreSeed[record.studentId] = String(record.score)
      if (record.feedback) commentSeed[record.studentId] = record.feedback
    })

    setScores(scoreSeed)
    setComments(commentSeed)
  }, [existingScores])

  useEffect(() => {
    const scoreSeed: Record<string, string> = {}
    const commentSeed: Record<string, string> = {}

    componentScores.forEach((record) => {
      const key = `${record.componentId}:${record.studentId}`
      if (record.score !== null) scoreSeed[key] = String(record.score)
      if (record.feedback) commentSeed[key] = record.feedback
    })

    setComponentScoreInputs(scoreSeed)
    setComponentCommentInputs(commentSeed)
  }, [componentScores])

  const isAuthorized =
    !!user?.teacherId &&
    !!cls &&
    (cls.mainTeacherIds.includes(user.teacherId) || cls.teachingAssistantIds.includes(user.teacherId))

  const handleSubmit = async () => {
    const records = enrolledStudents.map((student) => ({
      studentId: student.id,
      score: scores[student.id] !== '' && scores[student.id] !== undefined ? Number(scores[student.id]) : null,
      feedback: comments[student.id]?.trim() || undefined,
    }))

    const componentRecords = components.flatMap((component) =>
      enrolledStudents.map((student) => {
        const key = `${component.id}:${student.id}`
        return {
          componentId: component.id,
          studentId: student.id,
          score:
            component.isScorable &&
            componentScoreInputs[key] !== '' &&
            componentScoreInputs[key] !== undefined
              ? Number(componentScoreInputs[key])
              : null,
          feedback: componentCommentInputs[key]?.trim() || undefined,
        }
      }),
    )

    try {
      await upsertScores.mutateAsync({ assessmentId, records })
      await upsertComponentScores.mutateAsync({ assessmentId, records: componentRecords })
      toast.success('Scores and feedback saved successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save scores.')
    }
  }

  if (userLoading || classLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Access denied. You are not assigned to this class.
        </div>
      </div>
    )
  }

  if (assessmentLoading || scoresLoading || componentsLoading || componentScoresLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (assessmentError || !assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Assessment not found: {assessmentError?.message}
        </div>
      </div>
    )
  }

  const gradedCount = enrolledStudents.filter((student) => scores[student.id] !== '' && scores[student.id] !== undefined).length
  const displayedStudents = showOnlyUngraded
    ? enrolledStudents.filter((student) => scores[student.id] === '' || scores[student.id] === undefined)
    : enrolledStudents

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => navigate({ to: '/teacher/classes/$classId', params: { classId } })}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class
        </Button>
        <h1 className="text-2xl font-bold">Grade Assessment</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {assessment.title} • {ASSESSMENT_TYPE_LABELS[assessment.type]} • {gradedCount}/{enrolledStudents.length} graded
        </p>
      </div>

      <Card>
        <CardContent className="p-4 text-sm flex flex-wrap gap-6">
          <div>
            <span className="text-muted-foreground">Max score: </span>
            <span className="font-medium">{assessment.maxScore}</span>
          </div>
          <div>
            <Button
              type="button"
              variant={showOnlyUngraded ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyUngraded((value) => !value)}
            >
               {showOnlyUngraded ? 'Show all students' : 'Show ungraded only'}
            </Button>
          </div>
          {assessment.dueAt && (
            <div>
               <span className="text-muted-foreground">Due: </span>
              <span className="font-medium">{new Date(assessment.dueAt).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {enrolledStudents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
             No students in this class.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                     <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                     <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score (/{assessment.maxScore})</th>
                     <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayedStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-muted/50 align-top">
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
                          max={assessment.maxScore}
                          step={0.5}
                          value={scores[student.id] ?? ''}
                          onChange={(e) => setScores((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          placeholder="—"
                          className="w-24 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Textarea
                          value={comments[student.id] ?? ''}
                          onChange={(e) => setComments((prev) => ({ ...prev, [student.id]: e.target.value }))}
                           placeholder="Feedback for student"
                          className="min-h-16"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {components.map((component) => {
            const componentStudents = showOnlyUngraded
              ? enrolledStudents.filter((student) => {
                  const key = `${component.id}:${student.id}`
                  if (component.isScorable) {
                    return componentScoreInputs[key] === '' || componentScoreInputs[key] === undefined
                  }
                  return componentCommentInputs[key] === '' || componentCommentInputs[key] === undefined
                })
              : enrolledStudents

            return (
              <Card key={component.id}>
                <CardContent className="p-0 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/40 text-sm font-medium">
                    {component.title}
                    {component.isScorable && component.maxScore !== undefined && (
                      <span className="text-muted-foreground font-normal"> • /{component.maxScore}</span>
                    )}
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                         <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                        {component.isScorable && (
                           <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
                        )}
                         <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {componentStudents.map((student, index) => {
                        const key = `${component.id}:${student.id}`
                        return (
                          <tr key={student.id} className="hover:bg-muted/50 align-top">
                            <td className="px-4 py-3 text-muted-foreground text-xs">{index + 1}</td>
                            <td className="px-4 py-3 font-medium">
                              {student.name}
                              {student.phone && (
                                <span className="ml-2 text-xs text-muted-foreground">{student.phone}</span>
                              )}
                            </td>
                            {component.isScorable && (
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  min={0}
                                  max={component.maxScore ?? undefined}
                                  step={0.5}
                                  value={componentScoreInputs[key] ?? ''}
                                  onChange={(e) =>
                                    setComponentScoreInputs((prev) => ({ ...prev, [key]: e.target.value }))
                                  }
                                  placeholder="—"
                                  className="w-24 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                                />
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <Textarea
                                value={componentCommentInputs[key] ?? ''}
                                onChange={(e) =>
                                  setComponentCommentInputs((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                 placeholder="Feedback for student"
                                className="min-h-16"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {enrolledStudents.length > 0 && (
        <div className="flex items-center gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/teacher/classes/$classId', params: { classId } })}
          >
             Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={upsertScores.isPending || upsertComponentScores.isPending}
          >
             {upsertScores.isPending || upsertComponentScores.isPending ? 'Saving...' : 'Save scores and feedback'}
          </Button>
        </div>
      )}
    </div>
  )
}
