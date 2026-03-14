import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLessonById, useLessonAttendance, useUpsertAttendance } from '@/hooks/useLessons'
import { useClassStudents } from '@/hooks/useClasses'
import { useStudents } from '@/hooks/useStudents'
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_COLORS,
  ABSENCE_REASONS,
} from '@/lib/constants'
import type { AttendanceStatus } from '@/types/entities'
import { ArrowLeft, CheckCircle, ClipboardList } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute(
  '/_authenticated/_teacher/teacher/classes/$classId/lessons/$lessonId/attendance',
)({
  component: TeacherAttendancePage,
})

function TeacherAttendancePage() {
  const { classId, lessonId } = Route.useParams()
  const navigate = useNavigate()

  const { data: lesson, isLoading: lessonLoading } = useLessonById(lessonId)
  const { data: enrolledLinks = [] } = useClassStudents(classId)
  const { data: allStudents = [] } = useStudents()
  const { data: existingAttendance = [], isLoading: attendanceLoading } =
    useLessonAttendance(lessonId)
  const upsertAttendance = useUpsertAttendance()

  const enrolledStudents = allStudents.filter((s) =>
    enrolledLinks.some((l) => l.studentId === s.id),
  )
  const attendanceTaken = existingAttendance.length > 0

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    {},
  )
  const [absenceReasons, setAbsenceReasons] = useState<Record<string, string>>(
    {},
  )

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
    })
    setAttendance(seed)
    setAbsenceReasons(reasonSeed)
  }, [enrolledStudents.length, existingAttendance.length])

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {}
    enrolledStudents.forEach((s) => {
      next[s.id] = status
    })
    setAttendance(next)
  }

  const handleSubmit = async () => {
    const unmarked = enrolledStudents.filter((s) => !attendance[s.id])
    if (unmarked.length > 0) {
      toast.error(
        `Vui lòng điểm danh cho tất cả học sinh (còn ${unmarked.length} chưa được điểm danh)`,
      )
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
      navigate({ to: '/teacher/classes/$classId', params: { classId } })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể lưu điểm danh. Vui lòng thử lại.',
      )
    }
  }

  if (lessonLoading || attendanceLoading) {
    return (
      <Card className="container mx-auto max-w-2xl mt-8">
        <CardContent className="p-12 text-center text-muted-foreground">Đang tải...</CardContent>
      </Card>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
          Không tìm thấy buổi học.
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
          <Button variant="ghost" size="sm"
            type="button"
            onClick={() =>
              navigate({ to: '/teacher/classes/$classId', params: { classId } })
            }
            className="mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại lớp học
          </Button>
          <div className="flex items-center gap-3">
            <ClipboardList className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Điểm danh</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{lesson.title}</p>
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
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Bắt đầu: </span>
          <span className="font-medium">
            {new Date(lesson.startTime).toLocaleString('vi-VN')}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Kết thúc: </span>
          <span className="font-medium">
            {new Date(lesson.endTime).toLocaleString('vi-VN')}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Sĩ số: </span>
          <span className="font-medium">{totalCount} học sinh</span>
        </div>
        </CardContent>
      </Card>

      {/* Quick mark all */}
      {totalCount > 0 && (
        <Card>
          <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">
              Đánh dấu nhanh tất cả
            </h2>
            <span className="text-xs text-muted-foreground">
              {markedCount}/{totalCount} đã điểm danh
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              Object.entries(
                ATTENDANCE_STATUS_LABELS,
              ) as [AttendanceStatus, string][]
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => markAll(value)}
                className={ATTENDANCE_STATUS_COLORS[value]}
              >
                Tất cả: {label}
              </Button>
            ))}
          </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance table */}
      {totalCount === 0 ? (
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Học sinh
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Lý do nghỉ (nếu có)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrolledStudents.map((student, index) => {
                const status = attendance[student.id]
                const isAbsent =
                  status &&
                  ['absent_excused', 'absent_unexcused'].includes(status)
                return (
                  <tr key={student.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {student.name}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={status ?? ''}
                        onChange={(e) =>
                          setAttendance((prev) => ({
                            ...prev,
                            [student.id]: e.target.value as AttendanceStatus,
                          }))
                        }
                        className="px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                      >
                        <option value="" disabled>
                          -- Chọn --
                        </option>
                        {(
                          Object.entries(
                            ATTENDANCE_STATUS_LABELS,
                          ) as [AttendanceStatus, string][]
                        ).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
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
                          className="px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-ring bg-background"
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
          </CardContent>
        </Card>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={upsertAttendance.isPending}
        >
          {upsertAttendance.isPending ? 'Đang lưu...' : 'Lưu điểm danh'}
        </Button>
      </div>
    </div>
  )
}
