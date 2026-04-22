import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useClassGradebook } from '@/hooks/useGrades'
import { useStudents } from '@/hooks/useStudents'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/grades')({
  component: ClassGradesPage,
})

function ClassGradesPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: classData, isLoading: classLoading, error: classError } = useClassById(classId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: gradebook, isLoading: gradebookLoading } = useClassGradebook(classId)

  const assessments = gradebook?.assessments ?? []
  const components = gradebook?.components ?? []
  const overallScores = gradebook?.overallScores ?? []
  const componentScores = gradebook?.componentScores ?? []

  const componentByAssessmentId = new Map<string, typeof components>()
  components.forEach((component) => {
    const bucket = componentByAssessmentId.get(component.assessmentId)
    if (bucket) {
      bucket.push(component)
    } else {
      componentByAssessmentId.set(component.assessmentId, [component])
    }
  })

  const overallScoreMap = new Map<string, number | null>()
  overallScores.forEach((score) => {
    overallScoreMap.set(`${score.assessmentId}:${score.studentId}`, score.score)
  })

  const componentScoreMap = new Map<string, number | null>()
  componentScores.forEach((score) => {
    componentScoreMap.set(`${score.componentId}:${score.studentId}`, score.score)
  })

  const enrolledIds = new Set(enrolledLinks.map((link) => link.studentId))
  const enrolledStudents = allStudents.filter((student) => enrolledIds.has(student.id))

  if (classLoading || gradebookLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
      </Card>
    )
  }

  if (classError || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Class not found: {classError?.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to class
        </Button>
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <div>
             <h1 className="text-2xl font-bold">Class Gradebook</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{classData.name}</p>
          </div>
        </div>
      </div>

      {enrolledStudents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
             No students in this class.
          </CardContent>
        </Card>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
             No assessments yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-auto">
            <table className="w-full text-sm min-w-225 border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th rowSpan={2} className="px-4 py-3 text-left font-medium text-muted-foreground sticky left-0 bg-muted/50 z-20 border-r">
                     Student
                  </th>
                  {assessments.map((assessment) => {
                    const subComponents = componentByAssessmentId.get(assessment.id) ?? []
                    const columnCount = 1 + subComponents.length
                    return (
                      <th
                        key={assessment.id}
                        colSpan={columnCount}
                        className="px-3 py-3 text-center font-medium text-muted-foreground border-l"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground">{assessment.title}</div>
                          <div className="text-xs">{ASSESSMENT_TYPE_LABELS[assessment.type]}</div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
                <tr className="bg-muted/30 border-b">
                  {assessments.map((assessment) => {
                    const subComponents = componentByAssessmentId.get(assessment.id) ?? []
                    return (
                      <Fragment key={`${assessment.id}:columns`}>
                        <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground border-l whitespace-nowrap">
                           Total (/{assessment.maxScore})
                        </th>
                        {subComponents.map((component) => (
                          <th
                            key={`${assessment.id}:${component.id}`}
                            className="px-3 py-2 text-center text-xs font-medium text-muted-foreground border-l whitespace-nowrap"
                          >
                            {component.title}
                            {component.isScorable && component.maxScore !== undefined ? ` (/${component.maxScore})` : ''}
                          </th>
                        ))}
                      </Fragment>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrolledStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium sticky left-0 bg-background z-10 border-r whitespace-nowrap">
                      {student.name}
                    </td>
                    {assessments.map((assessment) => {
                      const subComponents = componentByAssessmentId.get(assessment.id) ?? []
                      const overall = overallScoreMap.get(`${assessment.id}:${student.id}`)

                      return (
                        <Fragment key={`${assessment.id}:${student.id}:cells`}>
                          <td className="px-3 py-3 text-center border-l">
                            {overall !== null && overall !== undefined ? (
                              <span className="font-medium">{overall}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          {subComponents.map((component) => {
                            const value = componentScoreMap.get(`${component.id}:${student.id}`)
                            return (
                              <td
                                key={`${assessment.id}:${component.id}:${student.id}`}
                                className="px-3 py-3 text-center border-l"
                              >
                                {value !== null && value !== undefined ? (
                                  <span className="font-medium">{value}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            )
                          })}
                        </Fragment>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
