import type { StaffRole, Subject, EnglishLevel, Relationship, Status, TeacherRole } from '@/types/entities'

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
