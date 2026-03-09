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
  'general-english',
  'business-english',
  'ielts',
  'toefl',
  'toeic',
  'kids-english',
  'conversation',
])

export const TeacherSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  subjects: z.array(SubjectSchema).min(1, 'At least one subject is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
  hireDate: z.string().or(z.date()),
  status: StatusSchema,
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  bio: z.string().optional(),
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

// ============= Utility Types =============
export type EntityType = 'staff' | 'teacher' | 'student' | 'parent'

export type Entity = Staff | Teacher | Student | Parent

export type Status = z.infer<typeof StatusSchema>
