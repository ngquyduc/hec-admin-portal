import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonById, useLessonAttendance, useUpsertAttendance } from '@/hooks/useLessons'
import { useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS, ABSENCE_REASONS } from '@/lib/constants'
import type { AttendanceStatus } from '@/types/entities'
import { ArrowLeft, CheckCircle, ClipboardList } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/classes/$classId/lessons/$lessonId/attendance')({
  component: AttendancePage,
})

function AttendancePage() {
  const { classId, lessonId } = Route.useParams()
  const navigate = useNavigate()

  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useLessonById(lessonId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingAttendance = [], isLoading: attendanceLoading } = useLessonAttendance(lessonId)
  const upsertAttendance = useUpsertAttendance()

  const enrolledStudentIds = enrolledLinks.map((l) => l.studentId)
  const enrolledStudents = allStudents.filter((s) => enrolledStudentIds.includes(s.id))

  const attendanceTaken = existingAttendance.length > 0

  // Map studentId → status
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
  // Map studentId → absence reason
  const [absenceReasons, setAbsenceReasons] = useState<Record<string, string>>({})

  // Seed from existing records; do NOT default to 'present' for new records
  useEffect(() => {
    if (enrolledStudents.length === 0) return
    const seed: Record<string, AttendanceStatus> = {}
    const reasonSeed: Record<string, string> = {}
    enrolledStudents.forEach((s) => {
      const existing = existingAttendance.find((a) => a.studentId === s.id)
      if (existing) {
        seed[s.id] = existing.status
        if (existing.notes) reasonSeed[s.id] = existing.notes
      }
      // If no existing record, leave unset — teacher must explicitly mark
    })
    setAttendance(seed)
    setAbsenceReasons(reasonSeed)
  }, [enrolledStudents.length, existingAttendance.length])

  const handleSubmit = async () => {
    // All enrolled students must be marked
    const unmarked = enrolledStudents.filter((s) => !attendance[s.id])
    if (unmarked.length > 0) {
      toast.error(`Vui lòng điểm danh cho tất cả học sinh (còn ${unmarked.length} chưa được điểm danh)`)
      return
    }

    try {
      const records = enrolledStudents.map((s) => ({
        lessonId,
        studentId: s.id,
        status: attendance[s.id],
        notes: ['absent_excused', 'absent_unexcused'].includes(attendance[s.id])
          ? (absenceReasons[s.id] ?? undefined)
          : undefined,
      }))
      await upsertAttendance.mutateAsync(records)
      toast.success('Điểm danh đã được lưu thành công!')
      navigate({ to: '/classes/$classId', params: { classId } })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu điểm danh. Vui lòng thử lại.')
    }
  }

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {}
    enrolledStudents.forEach((s) => { next[s.id] = status })
    setAttendance(next)
  }

  if (lessonLoading || attendanceLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          Đang tải...
        </div>
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

  const markedCount = Object.keys(attendance).length
  const totalCount = enrolledStudents.length

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
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
            <ClipboardList className="h-7 w-7 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
              <p className="text-gray-500 text-sm mt-0.5">{lesson.title}</p>
            </div>
          </div>
        </div>
        {attendanceTaken && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Đã điểm danh
          </div>
        )}
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

      {/* Quick-mark all */}
      {totalCount > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Đánh dấu nhanh tất cả</h2>
            <span className="text-xs text-gray-400">
              {markedCount}/{totalCount} đã điểm danh
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(ATTENDANCE_STATUS_LABELS) as [AttendanceStatus, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => markAll(value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${ATTENDANCE_STATUS_COLORS[value]} hover:opacity-80`}
              >
                Tất cả: {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attendance table */}
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
                <th className="px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Lý do nghỉ (nếu có)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrolledStudents.map((student, index) => {
                const status = attendance[student.id]
                const isAbsent = status && ['absent_excused', 'absent_unexcused'].includes(status)
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
                      <select
                        value={status ?? ''}
                        onChange={(e) => {
                          const newStatus = e.target.value as AttendanceStatus
                          setAttendance((prev) => ({ ...prev, [student.id]: newStatus }))
                          if (!['absent_excused', 'absent_unexcused'].includes(newStatus)) {
                            setAbsenceReasons((prev) => {
                              const next = { ...prev }
                              delete next[student.id]
                              return next
                            })
                          }
                        }}
                        className={`px-2 py-1.5 rounded text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer ${
                          status
                            ? ATTENDANCE_STATUS_COLORS[status]
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}
                      >
                        <option value="" disabled>
                          -- Chọn --
                        </option>
                        {(Object.entries(ATTENDANCE_STATUS_LABELS) as [AttendanceStatus, string][]).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {isAbsent && (
                        <select
                          value={absenceReasons[student.id] ?? ''}
                          onChange={(e) =>
                            setAbsenceReasons((prev) => ({
                              ...prev,
                              [student.id]: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">-- Chọn lý do --</option>
                          {ABSENCE_REASONS.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
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
            disabled={upsertAttendance.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upsertAttendance.isPending ? 'Đang lưu...' : 'Lưu điểm danh'}
          </button>
        </div>
      )}
    </div>
  )
}
