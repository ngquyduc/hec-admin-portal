import { z } from 'zod'

// ============= Common Schemas =============
export const ContactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
})

export const StatusSchema = z.enum(['active', 'inactive', 'suspended'])

// ============= Staff Schema =============
export const StaffRoleSchema = z.enum([
  'administrator',
  'coordinator',
  'receptionist',
  'accountant',
  'manager',
])

export const StaffSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  role: StaffRoleSchema,
  hireDate: z.string().or(z.date()),
  status: StatusSchema,
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateStaffSchema = StaffSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateStaffSchema = CreateStaffSchema.partial()

export type Staff = z.infer<typeof StaffSchema>
export type StaffRole = z.infer<typeof StaffRoleSchema>
export type CreateStaff = z.infer<typeof CreateStaffSchema>
export type UpdateStaff = z.infer<typeof UpdateStaffSchema>

// ============= Teacher Schema =============
export const SubjectSchema = z.enum([
  'ielts',
  'communication-english',
])

export const TeacherRoleSchema = z.enum([
  'main-teacher',
  'teaching-assistant',
])

export const TeacherSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  role: TeacherRoleSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  subjects: z.array(SubjectSchema).min(1, 'At least one subject is required'),
  hireDate: z.string().or(z.date()),
  status: StatusSchema,
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateTeacherSchema = TeacherSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateTeacherSchema = CreateTeacherSchema.partial()

export type Teacher = z.infer<typeof TeacherSchema>
export type TeacherRole = z.infer<typeof TeacherRoleSchema>
export type Subject = z.infer<typeof SubjectSchema>
export type CreateTeacher = z.infer<typeof CreateTeacherSchema>
export type UpdateTeacher = z.infer<typeof UpdateTeacherSchema>

// ============= Student Schema =============
export const EnglishLevelSchema = z.enum([
  'beginner',
  'elementary',
  'pre-intermediate',
  'intermediate',
  'upper-intermediate',
  'advanced',
  'proficient',
])

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().or(z.date()),
  enrollmentDate: z.string().or(z.date()),
  level: EnglishLevelSchema,
  status: StatusSchema,
  parentId: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateStudentSchema = StudentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateStudentSchema = CreateStudentSchema.partial()

export type Student = z.infer<typeof StudentSchema>
export type EnglishLevel = z.infer<typeof EnglishLevelSchema>
export type CreateStudent = z.infer<typeof CreateStudentSchema>
export type UpdateStudent = z.infer<typeof UpdateStudentSchema>

// ============= Parent Schema =============
export const RelationshipSchema = z.enum([
  'mother',
  'father',
  'guardian',
  'grandmother',
  'grandfather',
  'other',
])

export const ParentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .email('Invalid email address')
    .or(z.literal(''))
    .optional(),
  phone: z.string().min(1, 'Phone number is required'),
  relationship: RelationshipSchema,
  studentIds: z.array(z.string()).default([]),
  address: z.string().optional(),
  occupation: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateParentSchema = ParentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateParentSchema = CreateParentSchema.partial()

export type Parent = z.infer<typeof ParentSchema>
export type Relationship = z.infer<typeof RelationshipSchema>
export type CreateParent = z.infer<typeof CreateParentSchema>
export type UpdateParent = z.infer<typeof UpdateParentSchema>

// ============= Class Schema =============
export const ClassSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
  teacherId: z.string().min(1, 'Teacher is required'),
  assistantId: z.string().optional(),
  level: EnglishLevelSchema,
  status: StatusSchema,
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateClassSchema = ClassSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateClassSchema = CreateClassSchema.partial()

export type Class = z.infer<typeof ClassSchema>
export type CreateClass = z.infer<typeof CreateClassSchema>
export type UpdateClass = z.infer<typeof UpdateClassSchema>

// ============= Lesson Schema =============
export const LessonStatusSchema = z.enum([
  'scheduled',
  'ongoing',
  'completed',
  'cancelled',
])

export const LessonSchema = z.object({
  id: z.string(),
  classId: z.string().min(1, 'Class is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  status: LessonStatusSchema,
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateLessonSchema = LessonSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateLessonSchema = CreateLessonSchema.partial()

export type Lesson = z.infer<typeof LessonSchema>
export type LessonStatus = z.infer<typeof LessonStatusSchema>
export type CreateLesson = z.infer<typeof CreateLessonSchema>
export type UpdateLesson = z.infer<typeof UpdateLessonSchema>

// ============= Attendance Schema =============
export const AttendanceStatusSchema = z.enum([
  'present',
  'late',
  'absent_excused',
  'absent_unexcused',
])

export const AttendanceSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  studentId: z.string(),
  status: AttendanceStatusSchema,
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateAttendanceSchema = AttendanceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type Attendance = z.infer<typeof AttendanceSchema>
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>
export type CreateAttendance = z.infer<typeof CreateAttendanceSchema>

// ============= Grade Schemas =============
export const GradeTypeSchema = z.enum([
  'homework',
  'quiz',
  'exercise',
  'participation',
])

export const GradePeriodSchema = z.enum([
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'midterm',
  'final',
])

export const LessonGradeSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).nullable(),
  maxScore: z.number().min(0).default(10),
  gradeType: GradeTypeSchema,
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateLessonGradeSchema = LessonGradeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type LessonGrade = z.infer<typeof LessonGradeSchema>
export type GradeType = z.infer<typeof GradeTypeSchema>
export type CreateLessonGrade = z.infer<typeof CreateLessonGradeSchema>

export const ClassGradeSchema = z.object({
  id: z.string(),
  classId: z.string(),
  studentId: z.string(),
  period: GradePeriodSchema,
  score: z.number().min(0).max(100).nullable(),
  maxScore: z.number().default(100),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateClassGradeSchema = ClassGradeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type ClassGrade = z.infer<typeof ClassGradeSchema>
export type GradePeriod = z.infer<typeof GradePeriodSchema>
export type CreateClassGrade = z.infer<typeof CreateClassGradeSchema>

// ============= Utility Types =============
export type EntityType = 'staff' | 'teacher' | 'student' | 'parent' | 'class' | 'lesson'

export type Entity = Staff | Teacher | Student | Parent | Class | Lesson

export type Status = z.infer<typeof StatusSchema>
