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
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().or(z.date()).optional(),
  enrollmentDate: z.string().or(z.date()),
  entryResult: z.string().optional(),
  exitTarget: z.string().optional(),
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

// ============= Entry Test Candidate Schema =============
export const EntryTestDecisionStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
])

export const EntryTestCandidateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().or(z.date()).optional(),
  testDate: z.string().or(z.date()),
  entryResult: z.string().min(1, 'Entry result is required'),
  recommendedLevel: EnglishLevelSchema.optional(),
  decisionStatus: EntryTestDecisionStatusSchema,
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateEntryTestCandidateSchema = EntryTestCandidateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateEntryTestCandidateSchema = CreateEntryTestCandidateSchema.partial()

export type EntryTestCandidate = z.infer<typeof EntryTestCandidateSchema>
export type EntryTestDecisionStatus = z.infer<typeof EntryTestDecisionStatusSchema>
export type CreateEntryTestCandidate = z.infer<typeof CreateEntryTestCandidateSchema>
export type UpdateEntryTestCandidate = z.infer<typeof UpdateEntryTestCandidateSchema>

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
export const ClassTypeSchema = SubjectSchema

export const ClassLevelSchema = z.enum([
  'beginner',
  'elementary',
  'pre-intermediate',
  'intermediate',
  'upper-intermediate',
  'pre-ielts',
  '3.5-4.5',
  '4.5-5.5',
  '5.5-6.5',
  '6.5-7.0+',
])

export const ClassSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
  mainTeacherIds: z.array(z.string()).min(1, 'At least one main teacher is required'),
  teachingAssistantIds: z.array(z.string()).min(1, 'At least one teaching assistant is required'),
  classType: ClassTypeSchema,
  level: ClassLevelSchema,
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
export type ClassType = z.infer<typeof ClassTypeSchema>
export type ClassLevel = z.infer<typeof ClassLevelSchema>
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

// ============= Assessment Schemas =============
export const AssessmentTypeSchema = z.enum([
  'classwork',
  'homework',
  'progress-check',
])

export const AssessmentSchema = z.object({
  id: z.string(),
  classId: z.string(),
  lessonId: z.string().optional(),
  type: AssessmentTypeSchema,
  title: z.string().min(1, 'Title is required'),
  maxScore: z.number().min(0.1).default(10),
  weight: z.number().min(0.1).default(1),
  assignedAt: z.string().or(z.date()),
  dueAt: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateAssessmentSchema = AssessmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const AssessmentScoreSchema = z.object({
  id: z.string(),
  assessmentId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).nullable(),
  feedback: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateAssessmentScoreSchema = AssessmentScoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const AssessmentComponentSchema = z.object({
  id: z.string(),
  assessmentId: z.string(),
  title: z.string().min(1, 'Title is required'),
  isScorable: z.boolean().default(true),
  maxScore: z.number().min(0.1).optional(),
  displayOrder: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateAssessmentComponentSchema = AssessmentComponentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const AssessmentComponentScoreSchema = z.object({
  id: z.string(),
  componentId: z.string(),
  studentId: z.string(),
  score: z.number().min(0).nullable(),
  feedback: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

export const CreateAssessmentComponentScoreSchema = AssessmentComponentScoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const AssessmentScoreRecordSchema = z.object({
  assessmentId: z.string(),
  classId: z.string(),
  lessonId: z.string().optional(),
  type: AssessmentTypeSchema,
  title: z.string(),
  maxScore: z.number().min(0.1),
  weight: z.number().min(0.1),
  studentId: z.string(),
  score: z.number().min(0).nullable(),
  feedback: z.string().optional(),
})

export type AssessmentType = z.infer<typeof AssessmentTypeSchema>
export type Assessment = z.infer<typeof AssessmentSchema>
export type CreateAssessment = z.infer<typeof CreateAssessmentSchema>
export type AssessmentScore = z.infer<typeof AssessmentScoreSchema>
export type CreateAssessmentScore = z.infer<typeof CreateAssessmentScoreSchema>
export type AssessmentComponent = z.infer<typeof AssessmentComponentSchema>
export type CreateAssessmentComponent = z.infer<typeof CreateAssessmentComponentSchema>
export type AssessmentComponentScore = z.infer<typeof AssessmentComponentScoreSchema>
export type CreateAssessmentComponentScore = z.infer<typeof CreateAssessmentComponentScoreSchema>
export type AssessmentScoreRecord = z.infer<typeof AssessmentScoreRecordSchema>

// ============= Feedback Schema =============
export const FeedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userRole: z.enum(['admin', 'teacher']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(10, 'Feedback message must be at least 10 characters'),
  createdAt: z.string().or(z.date()),
})

export const CreateFeedbackSchema = FeedbackSchema.omit({
  id: true,
  createdAt: true,
})

export type Feedback = z.infer<typeof FeedbackSchema>
export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>

// ============= Utility Types =============
export type EntityType = 'staff' | 'teacher' | 'student' | 'parent' | 'class' | 'lesson'

export type Entity = Staff | Teacher | Student | Parent | Class | Lesson

export type Status = z.infer<typeof StatusSchema>
