import type { StaffRole, Subject, EnglishLevel, Relationship, Status, TeacherRole, LessonStatus, AttendanceStatus } from '@/types/entities'

// Display labels for entity types
export const ENTITY_LABELS = {
  staff: 'Staff',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
} as const

// Staff role labels
export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  administrator: 'Administrator',
  coordinator: 'Coordinator',
  receptionist: 'Receptionist',
  accountant: 'Accountant',
  manager: 'Manager',
}

// Subject labels
export const SUBJECT_LABELS: Record<Subject, string> = {
  'ielts': 'IELTS',
  'communication-english': 'Tiếng Anh giao tiếp',
}

// English level labels
export const ENGLISH_LEVEL_LABELS: Record<EnglishLevel, string> = {
  beginner: 'Beginner',
  elementary: 'Elementary',
  'pre-intermediate': 'Pre-Intermediate',
  intermediate: 'Intermediate',
  'upper-intermediate': 'Upper-Intermediate',
  advanced: 'Advanced',
  proficient: 'Proficient',
}

// Relationship labels
export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  mother: 'Mother',
  father: 'Father',
  guardian: 'Guardian',
  grandmother: 'Grandmother',
  grandfather: 'Grandfather',
  other: 'Other',
}

// Teacher role labels
export const TEACHER_ROLE_LABELS: Record<TeacherRole, string> = {
  'main-teacher': 'Main Teacher',
  'teaching-assistant': 'Teaching Assistant',
}

// Status labels
export const STATUS_LABELS: Record<Status, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
}

// Status colors for UI
export const STATUS_COLORS: Record<Status, string> = {
  active: 'text-green-600 bg-green-50',
  inactive: 'text-gray-600 bg-gray-50',
  suspended: 'text-red-600 bg-red-50',
}

// Lesson status labels
export const LESSON_STATUS_LABELS: Record<LessonStatus, string> = {
  scheduled: 'Scheduled',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// Lesson status colors
export const LESSON_STATUS_COLORS: Record<LessonStatus, string> = {
  scheduled: 'text-blue-600 bg-blue-50',
  ongoing: 'text-yellow-600 bg-yellow-50',
  completed: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

// Attendance status labels (Vietnamese)
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Có mặt',
  late: 'Đi trễ',
  absent_excused: 'Nghỉ có phép',
  absent_unexcused: 'Nghỉ không phép',
}

// Attendance status colors
export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'text-green-600 bg-green-50',
  late: 'text-yellow-600 bg-yellow-50',
  absent_excused: 'text-blue-600 bg-blue-50',
  absent_unexcused: 'text-red-600 bg-red-50',
}

// Absence reason options (Vietnamese)
export const ABSENCE_REASONS = [
  'Ốm',
  'Đi du lịch',
  'Việc gia đình đột xuất',
  'Việc gia đình có lịch trước (ngày giỗ, đám cưới...)',
  'Lịch học đột xuất ở trường',
  'Hoạt động khác ở trường (có lịch trước)',
  'Không thông báo, không rõ lý do',
  'Học buổi khác',
] as const
