import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonById } from '@/hooks/useLessons'
import { useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { useLessonGrades, useUpsertLessonGrades } from '@/hooks/useGrades'
import { GRADE_TYPE_LABELS } from '@/lib/constants'
import type { GradeType } from '@/types/entities'
import { ArrowLeft, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/classes/$classId/lessons/$lessonId/grades')({
  component: LessonGradesPage,
})

const GRADE_TYPES = Object.keys(GRADE_TYPE_LABELS) as GradeType[]

function LessonGradesPage() {
  const { classId, lessonId } = Route.useParams()
  const navigate = useNavigate()

  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useLessonById(lessonId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingGrades = [], isLoading: gradesLoading } = useLessonGrades(lessonId)
  const upsertGrades = useUpsertLessonGrades()

  const [gradeType, setGradeType] = useState<GradeType>('quiz')
  const [maxScore, setMaxScore] = useState<number>(10)
  // Map studentId → score string (empty = not graded)
  const [scores, setScores] = useState<Record<string, string>>({})

  const enrolledStudentIds = enrolledLinks.map((l) => l.studentId)
  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.includes(s.id))

  // Seed scores from existing records for the selected gradeType
  useEffect(() => {
    const seed: Record<string, string> = {}
    enrolledStudents.forEach((s) => {
      const found = existingGrades.find(
        (g) => g.studentId === s.id && g.gradeType === gradeType,
      )
      if (found && found.score !== null) {
        seed[s.id] = String(found.score)
      }
    })
    setScores(seed)
    // Also sync maxScore from first existing record for this type
    const firstRecord = existingGrades.find((g) => g.gradeType === gradeType)
    if (firstRecord) setMaxScore(firstRecord.maxScore)
  }, [enrolledStudents.length, existingGrades.length, gradeType])

  const gradedCount = Object.values(scores).filter((v) => v !== '').length

  const handleSubmit = async () => {
    const records = enrolledStudents.map((s) => ({
      lessonId,
      studentId: s.id,
      score: scores[s.id] !== '' && scores[s.id] !== undefined ? Number(scores[s.id]) : null,
      maxScore,
      gradeType,
    }))

    try {
      await upsertGrades.mutateAsync(records)
      toast.success('Điểm đã được lưu thành công!')
      navigate({ to: '/classes/$classId', params: { classId } })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu điểm. Vui lòng thử lại.')
    }
  }

  if (lessonLoading || gradesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (lessonError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Không tìm thấy buổi học: {lessonError?.message}
        </div>
      </div>
    )
  }

  const totalCount = enrolledStudents.length

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
          <Star className="h-7 w-7 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chấm điểm</h1>
            <p className="text-gray-500 text-sm mt-0.5">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Lesson info */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-gray-500">Thời gian bắt đầu: </span>
          <span className="font-medium text-gray-900">
            {new Date(lesson.startTime).toLocaleString('vi-VN')}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Thời gian kết thúc: </span>
          <span className="font-medium text-gray-900">
            {new Date(lesson.endTime).toLocaleString('vi-VN')}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Sĩ số: </span>
          <span className="font-medium text-gray-900">{totalCount} học sinh</span>
        </div>
      </div>

      {/* Grade type and max score selector */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại điểm</label>
          <div className="flex gap-2 flex-wrap">
            {GRADE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGradeType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  gradeType === type
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {GRADE_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Điểm tối đa</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm text-gray-500">
          {gradedCount}/{totalCount} đã chấm điểm
        </div>
      </div>

      {/* Grades table */}
      {totalCount === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Không có học sinh nào trong lớp.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 w-8">#</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Học sinh</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Điểm (/{maxScore})
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 w-16">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrolledStudents.map((student, index) => {
                const rawVal = scores[student.id]
                const numVal = rawVal !== '' && rawVal !== undefined ? Number(rawVal) : null
                const pct =
                  numVal !== null && maxScore > 0
                    ? Math.round((numVal / maxScore) * 100)
                    : null

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
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={upsertGrades.isPending}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upsertGrades.isPending ? 'Đang lưu...' : 'Lưu điểm'}
          </button>
        </div>
      )}
    </div>
  )
}
