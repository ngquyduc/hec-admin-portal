// Database types for Supabase
// These types represent the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          role: 'administrator' | 'coordinator' | 'receptionist' | 'accountant' | 'manager'
          hire_date: string
          status: 'active' | 'inactive' | 'suspended'
          address: string | null
          emergency_contact: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          role: 'administrator' | 'coordinator' | 'receptionist' | 'accountant' | 'manager'
          hire_date: string
          status?: 'active' | 'inactive' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          role?: 'administrator' | 'coordinator' | 'receptionist' | 'accountant' | 'manager'
          hire_date?: string
          status?: 'active' | 'inactive' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teacher: {
        Row: {
          id: string
          name: string
          role: 'main-teacher' | 'teaching-assistant'
          email: string
          phone: string
          subjects: Array<'ielts' | 'communication-english'>
          qualifications: string | null
          hire_date: string
          status: 'active' | 'inactive' | 'suspended'
          hourly_rate: number | null
          address: string | null
          emergency_contact: string | null
          bio: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: 'main-teacher' | 'teaching-assistant'
          email: string
          phone: string
          subjects: Array<'ielts' | 'communication-english'>
          hire_date: string
          status?: 'active' | 'inactive' | 'suspended'
          qualifications?: string | null
          hourly_rate?: number | null
          address?: string | null
          emergency_contact?: string | null
          bio?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'main-teacher' | 'teaching-assistant'
          email?: string
          phone?: string
          subjects?: Array<'ielts' | 'communication-english'>
          qualifications?: string | null
          hire_date?: string
          status?: 'active' | 'inactive' | 'suspended'
          hourly_rate?: number | null
          address?: string | null
          emergency_contact?: string | null
          bio?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          date_of_birth: string
          enrollment_date: string
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
          status: 'active' | 'inactive' | 'suspended'
          parent_id: string | null
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          date_of_birth: string
          enrollment_date: string
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
          status?: 'active' | 'inactive' | 'suspended'
          parent_id?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string
          enrollment_date?: string
          level?: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
          status?: 'active' | 'inactive' | 'suspended'
          parent_id?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parent: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          relationship: 'mother' | 'father' | 'guardian' | 'grandmother' | 'grandfather' | 'other'
          student_ids: string[]
          address: string | null
          occupation: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          relationship: 'mother' | 'father' | 'guardian' | 'grandmother' | 'grandfather' | 'other'
          student_ids?: string[]
          address?: string | null
          occupation?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          relationship?: 'mother' | 'father' | 'guardian' | 'grandmother' | 'grandfather' | 'other'
          student_ids?: string[]
          address?: string | null
          occupation?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
