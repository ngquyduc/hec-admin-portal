import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useClassAssessmentScores, useUpsertClassAssessmentScores } from '@/hooks/useGrades'
import { ASSESSMENT_TYPE_LABELS } from '@/lib/constants'
import type { AssessmentType } from '@/types/entities'
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/_admin/classes/$classId/grades')({
  component: ClassGradesPage,
})

const ASSESSMENT_TYPES = Object.keys(ASSESSMENT_TYPE_LABELS) as AssessmentType[]

function ClassGradesPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: classData, isLoading: classLoading, error: classError } = useClassById(classId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingScores = [], isLoading: gradesLoading } = useClassAssessmentScores(classId)
  const upsertScores = useUpsertClassAssessmentScores()

  const [selectedType, setSelectedType] = useState<AssessmentType>('progress-check')
  const [maxScore, setMaxScore] = useState<number>(100)
  // Map studentId → score string for the selected assessment type
  const [scores, setScores] = useState<Record<string, string>>({})

  const enrolledStudentIds = enrolledLinks.map((l) => l.studentId)
  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.includes(s.id))

  // Seed scores when assessment type or existing data changes
  useEffect(() => {
    const seed: Record<string, string> = {}
    enrolledStudents.forEach((s) => {
      const found = existingScores.find(
        (g) => g.studentId === s.id && g.type === selectedType,
      )
      if (found && found.score !== null) {
        seed[s.id] = String(found.score)
      }
    })
    setScores(seed)
    const firstRecord = existingScores.find((g) => g.type === selectedType)
    if (firstRecord) setMaxScore(firstRecord.maxScore)
  }, [enrolledStudents.length, existingScores.length, selectedType])

  const gradedCount = Object.values(scores).filter((v) => v !== '').length
  const totalCount = enrolledStudents.length

  // Check which assessment types have any data
  const gradedTypes = new Set(existingScores.map((g) => g.type))

  const handleSubmit = async () => {
    const records = enrolledStudents.map((s) => ({
      studentId: s.id,
      score: scores[s.id] !== '' && scores[s.id] !== undefined ? Number(scores[s.id]) : null,
    }))

    try {
      await upsertScores.mutateAsync({
        classId,
        type: selectedType,
        title: ASSESSMENT_TYPE_LABELS[selectedType],
        maxScore,
        records,
      })
      toast.success('Điểm đã được lưu thành công!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu điểm. Vui lòng thử lại.')
    }
  }

  if (classLoading || gradesLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Đang tải...</CardContent>
      </Card>
    )
  }

  if (classError || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Không tìm thấy lớp học: {classError?.message}
        </div>
      </div>
    )
  }

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
          Quay lại lớp học
        </Button>
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Bảng điểm lớp học</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{classData.name}</p>
          </div>
        </div>
      </div>

      {/* Assessment type selector */}
      <Card>
        <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Chọn loại đánh giá</h2>
          <span className="text-xs text-muted-foreground">{gradedCount}/{totalCount} đã có điểm</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ASSESSMENT_TYPES.map((type) => {
            const hasData = gradedTypes.has(type)
            return (
              <Button
                key={type}
                type="button"
                variant={selectedType === type ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="gap-1.5"
              >
                {hasData && <CheckCircle className="h-3 w-3 text-green-500" />}
                {ASSESSMENT_TYPE_LABELS[type]}
              </Button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Điểm tối đa:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
          />
        </div>
        </CardContent>
      </Card>

      {/* Scores table for selected assessment type */}
      {totalCount === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Không có học sinh nào trong lớp.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
          <div className="px-4 py-3 bg-muted/50 border-b">
            <span className="text-sm font-semibold">
              {ASSESSMENT_TYPE_LABELS[selectedType]}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Học sinh</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Điểm (/{maxScore})
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">%</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrolledStudents.map((student, index) => {
                const rawVal = scores[student.id]
                const numVal =
                  rawVal !== '' && rawVal !== undefined ? Number(rawVal) : null
                const pct =
                  numVal !== null && maxScore > 0
                    ? Math.round((numVal / maxScore) * 100)
                    : null
                const grade =
                  pct === null
                    ? null
                    : pct >= 90
                      ? 'Xuất sắc'
                      : pct >= 80
                        ? 'Giỏi'
                        : pct >= 65
                          ? 'Khá'
                          : pct >= 50
                            ? 'Trung bình'
                            : 'Yếu'
                const gradeColor =
                  pct === null
                    ? ''
                    : pct >= 90
                      ? 'text-purple-600'
                      : pct >= 80
                        ? 'text-green-600'
                        : pct >= 65
                          ? 'text-blue-600'
                          : pct >= 50
                            ? 'text-yellow-600'
                            : 'text-red-600'

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
                    <td className="px-4 py-3">
                      {pct !== null ? (
                        <span className={`font-medium ${gradeColor}`}>{pct}%</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {grade ? (
                        <span className={`text-xs font-medium ${gradeColor}`}>{grade}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
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

      {/* Summary across all assessment types */}
      {existingScores.length > 0 && enrolledStudents.length > 0 && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
          <div className="px-4 py-3 bg-muted/50 border-b">
            <span className="text-sm font-semibold">Tổng quan tất cả loại đánh giá</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Học sinh</th>
                  {ASSESSMENT_TYPES.filter((type) => gradedTypes.has(type)).map((type) => (
                    <th key={type} className="px-4 py-3 text-center font-medium text-muted-foreground">
                      {ASSESSMENT_TYPE_LABELS[type]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrolledStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    {ASSESSMENT_TYPES.filter((type) => gradedTypes.has(type)).map((type) => {
                      const record = existingScores.find(
                        (g) => g.studentId === student.id && g.type === type,
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
          </div>
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
            Quay lại
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={upsertScores.isPending}
          >
            {upsertScores.isPending ? 'Đang lưu...' : `Lưu điểm ${ASSESSMENT_TYPE_LABELS[selectedType]}`}
          </Button>
        </div>
      )}
    </div>
  )
}
