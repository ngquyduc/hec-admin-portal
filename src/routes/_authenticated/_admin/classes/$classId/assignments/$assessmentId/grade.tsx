import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useAssessmentById, useAssessmentScores, useUpsertAssessmentScoresById } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/assignments/$assessmentId/grade')({
  component: GradeAssignmentPage,
})

function GradeAssignmentPage() {
  const { classId, assessmentId } = Route.useParams()
  const navigate = useNavigate()

  const { data: assessment, isLoading: assessmentLoading, error: assessmentError } = useAssessmentById(assessmentId)
  const { data: existingScores = [], isLoading: scoresLoading } = useAssessmentScores(assessmentId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const upsertScores = useUpsertAssessmentScoresById()

  const [scores, setScores] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

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

  const handleSubmit = async () => {
    const records = enrolledStudents.map((student) => ({
      studentId: student.id,
      score: scores[student.id] !== '' && scores[student.id] !== undefined ? Number(scores[student.id]) : null,
      feedback: comments[student.id]?.trim() || undefined,
    }))

    try {
      await upsertScores.mutateAsync({ assessmentId, records })
      toast.success('Đã lưu điểm và nhận xét thành công!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu điểm.')
    }
  }

  if (assessmentLoading || scoresLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Đang tải...</CardContent>
      </Card>
    )
  }

  if (assessmentError || !assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Không tìm thấy bài đánh giá: {assessmentError?.message}
        </div>
      </div>
    )
  }

  const gradedCount = enrolledStudents.filter((student) => scores[student.id] !== '' && scores[student.id] !== undefined).length

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
          Quay lại lớp học
        </Button>
        <h1 className="text-2xl font-bold">Chấm điểm bài đánh giá</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {assessment.title} • {ASSESSMENT_TYPE_LABELS[assessment.type]} • {gradedCount}/{enrolledStudents.length} đã chấm
        </p>
      </div>

      <Card>
        <CardContent className="p-4 text-sm flex flex-wrap gap-6">
          <div>
            <span className="text-muted-foreground">Điểm tối đa: </span>
            <span className="font-medium">{assessment.maxScore}</span>
          </div>
          {assessment.dueAt && (
            <div>
              <span className="text-muted-foreground">Hạn nộp: </span>
              <span className="font-medium">{new Date(assessment.dueAt).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {enrolledStudents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Không có học sinh nào trong lớp.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Học sinh</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Điểm (/{assessment.maxScore})</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nhận xét</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrolledStudents.map((student, index) => (
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
                        placeholder="Nhận xét cho học sinh"
                        className="min-h-16"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {enrolledStudents.length > 0 && (
        <div className="flex items-center gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={upsertScores.isPending}>
            {upsertScores.isPending ? 'Đang lưu...' : 'Lưu điểm và nhận xét'}
          </Button>
        </div>
      )}
    </div>
  )
}
