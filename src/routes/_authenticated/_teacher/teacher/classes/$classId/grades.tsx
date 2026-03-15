import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useClassAssessmentScores } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { AssessmentType } from '@/types/entities'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_teacher/teacher/classes/$classId/grades')({
  component: TeacherGradesPage,
})

const ASSESSMENT_TYPES = Object.keys(ASSESSMENT_TYPE_LABELS) as AssessmentType[]

function TeacherGradesPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: cls } = useClassById(classId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: scores = [] } = useClassAssessmentScores(classId)

  const enrolledIds = new Set(enrolledLinks.map((l) => l.studentId))
  const enrolledStudents = allStudents.filter((s) => enrolledIds.has(s.id))
  const gradedTypes = ASSESSMENT_TYPES.filter((type) => scores.some((score) => score.type === type))

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <Button variant="ghost" size="sm"
          onClick={() => navigate({ to: '/teacher/classes/$classId', params: { classId } })}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to class
        </Button>
        <h1 className="text-2xl font-bold">Bảng điểm lớp học</h1>
        {cls && <p className="text-muted-foreground text-sm mt-1">{cls.name}</p>}
      </div>

      {gradedTypes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No grades recorded yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Học sinh
                </th>
                {gradedTypes.map((type) => (
                  <th
                    key={type}
                    className="px-4 py-3 text-center font-medium text-muted-foreground"
                  >
                    {ASSESSMENT_TYPE_LABELS[type]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrolledStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    {student.name}
                  </td>
                  {gradedTypes.map((type) => {
                    const record = scores.find(
                      (score) => score.studentId === student.id && score.type === type,
                    )
                    const pct =
                      record?.score != null && record.maxScore > 0
                        ? Math.round((record.score / record.maxScore) * 100)
                        : null
                    return (
                      <td key={type} className="px-4 py-3 text-center">
                        {record?.score != null ? (
                          <span
                            className={`font-medium ${
                              pct! >= 80
                                ? 'text-green-600'
                                : pct! >= 50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {record.score}/{record.maxScore}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
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
