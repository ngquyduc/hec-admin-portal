export type UserRole = 'admin' | 'teacher'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  teacherId?: string // only populated when role === 'teacher'
  permissions?: string[]
}
