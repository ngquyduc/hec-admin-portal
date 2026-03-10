import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useClassById, useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useClassGrades, useUpsertClassGrades } from '@/hooks/useGrades'
import { GRADE_PERIOD_LABELS } from '@/lib/constants'
import type { GradePeriod } from '@/types/entities'
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/classes/$classId/grades')({
  component: ClassGradesPage,
})

const PERIODS = Object.keys(GRADE_PERIOD_LABELS) as GradePeriod[]

function ClassGradesPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: classData, isLoading: classLoading, error: classError } = useClassById(classId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingGrades = [], isLoading: gradesLoading } = useClassGrades(classId)
  const upsertGrades = useUpsertClassGrades()

  const [selectedPeriod, setSelectedPeriod] = useState<GradePeriod>('Q1')
  const [maxScore, setMaxScore] = useState<number>(100)
  // Map studentId → score string for the selected period
  const [scores, setScores] = useState<Record<string, string>>({})

  const enrolledStudentIds = enrolledLinks.map((l) => l.studentId)
  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.includes(s.id))

  // Seed scores when period or existing data changes
  useEffect(() => {
    const seed: Record<string, string> = {}
    enrolledStudents.forEach((s) => {
      const found = existingGrades.find(
        (g) => g.studentId === s.id && g.period === selectedPeriod,
      )
      if (found && found.score !== null) {
        seed[s.id] = String(found.score)
      }
    })
    setScores(seed)
    const firstRecord = existingGrades.find((g) => g.period === selectedPeriod)
    if (firstRecord) setMaxScore(firstRecord.maxScore)
  }, [enrolledStudents.length, existingGrades.length, selectedPeriod])

  const gradedCount = Object.values(scores).filter((v) => v !== '').length
  const totalCount = enrolledStudents.length

  // Check which periods have any data
  const gradedPeriods = new Set(existingGrades.map((g) => g.period))

  const handleSubmit = async () => {
    const records = enrolledStudents.map((s) => ({
      classId,
      studentId: s.id,
      period: selectedPeriod,
      score:
        scores[s.id] !== '' && scores[s.id] !== undefined ? Number(scores[s.id]) : null,
      maxScore,
    }))

    try {
      await upsertGrades.mutateAsync(records)
      toast.success('Điểm đã được lưu thành công!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu điểm. Vui lòng thử lại.')
    }
  }

  if (classLoading || gradesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (classError || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Không tìm thấy lớp học: {classError?.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại lớp học
        </button>
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bảng điểm lớp học</h1>
            <p className="text-gray-500 text-sm mt-0.5">{classData.name}</p>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Chọn kỳ</h2>
          <span className="text-xs text-gray-400">{gradedCount}/{totalCount} đã có điểm</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((period) => {
            const hasData = gradedPeriods.has(period)
            return (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  selectedPeriod === period
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {hasData && <CheckCircle className="h-3 w-3 text-green-500" />}
                {GRADE_PERIOD_LABELS[period]}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Điểm tối đa:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grades table for selected period */}
      {totalCount === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Không có học sinh nào trong lớp.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
            <span className="text-sm font-semibold text-indigo-700">
              {GRADE_PERIOD_LABELS[selectedPeriod]}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 w-8">#</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Học sinh</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Điểm (/{maxScore})
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 w-16">%</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
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
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {student.name}
                      {student.phone && (
                        <span className="ml-2 text-xs text-gray-400">{student.phone}</span>
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
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {pct !== null ? (
                        <span className={`font-medium ${gradeColor}`}>{pct}%</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {grade ? (
                        <span className={`text-xs font-medium ${gradeColor}`}>{grade}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary across all periods */}
      {existingGrades.length > 0 && enrolledStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Tổng quan tất cả các kỳ</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Học sinh</th>
                  {PERIODS.filter((p) => gradedPeriods.has(p)).map((p) => (
                    <th key={p} className="px-4 py-3 text-center font-medium text-gray-700">
                      {GRADE_PERIOD_LABELS[p]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrolledStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                    {PERIODS.filter((p) => gradedPeriods.has(p)).map((p) => {
                      const record = existingGrades.find(
                        (g) => g.studentId === student.id && g.period === p,
                      )
                      const pct =
                        record?.score != null && record.maxScore > 0
                          ? Math.round((record.score / record.maxScore) * 100)
                          : null
                      return (
                        <td key={p} className="px-4 py-3 text-center">
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
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      {totalCount > 0 && (
        <div className="flex items-center gap-4 pb-8">
          <button
            type="button"
            onClick={() => navigate({ to: '/classes/$classId', params: { classId } })}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={upsertGrades.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upsertGrades.isPending ? 'Đang lưu...' : `Lưu điểm ${GRADE_PERIOD_LABELS[selectedPeriod]}`}
          </button>
        </div>
      )}
    </div>
  )
}
