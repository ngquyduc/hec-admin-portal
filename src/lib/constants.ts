import type { StaffRole, Subject, EnglishLevel, Relationship, Status, TeacherRole, LessonStatus, AttendanceStatus, AssessmentType, ClassLevel } from '@/types/entities'

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
  'communication-english': 'Communication English',
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

// Class level labels
export const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  beginner: 'Beginner',
  elementary: 'Elementary',
  'pre-intermediate': 'Pre-Intermediate',
  intermediate: 'Intermediate',
  'upper-intermediate': 'Upper-Intermediate',
  'pre-ielts': 'Pre-IELTS (below 3.4)',
  '3.5-4.5': '3.5-4.5',
  '4.5-5.5': '4.5-5.5',
  '5.5-6.5': '5.5-6.5',
  '6.5-7.0+': '6.5-7.0+',
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

// Attendance status labels
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  late: 'Late',
  absent_excused: 'Excused Absence',
  absent_unexcused: 'Unexcused Absence',
}

// Attendance status colors
export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'text-green-600 bg-green-50',
  late: 'text-yellow-600 bg-yellow-50',
  absent_excused: 'text-blue-600 bg-blue-50',
  absent_unexcused: 'text-red-600 bg-red-50',
}

// Assessment type labels
export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  'in-class': 'In-class Assignment',
  homework: 'Homework',
  test: 'Progress Test',
}

// Absence reason options
export const ABSENCE_REASONS = [
  'Sick',
  'Traveling',
  'Family emergency',
  'Planned family event (anniversary, wedding, etc.)',
  'Unexpected school schedule',
  'Other school activity (planned)',
  'No notice, unknown reason',
  'Attending another session',
] as const
