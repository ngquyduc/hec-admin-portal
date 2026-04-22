// Database types for Supabase
// These types represent the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          role: 'administrator' | 'coordinator' | 'receptionist' | 'accountant' | 'manager'
          hire_date: string | null
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
          hire_date?: string | null
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
          hire_date?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          date_of_birth: string | null
          enrollment_date: string
          entry_result: string | null
          exit_target: string | null
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
          phone: string
          date_of_birth?: string | null
          enrollment_date: string
          entry_result?: string | null
          exit_target?: string | null
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
          phone?: string
          date_of_birth?: string | null
          enrollment_date?: string
          entry_result?: string | null
          exit_target?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          parent_id?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      entry_test_candidate: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          date_of_birth: string | null
          test_date: string
          entry_result: string
          recommended_level:
            | 'beginner'
            | 'elementary'
            | 'pre-intermediate'
            | 'intermediate'
            | 'upper-intermediate'
            | 'advanced'
            | 'proficient'
            | null
          decision_status: 'pending' | 'accepted' | 'rejected'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          date_of_birth?: string | null
          test_date?: string
          entry_result: string
          recommended_level?:
            | 'beginner'
            | 'elementary'
            | 'pre-intermediate'
            | 'intermediate'
            | 'upper-intermediate'
            | 'advanced'
            | 'proficient'
            | null
          decision_status?: 'pending' | 'accepted' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          date_of_birth?: string | null
          test_date?: string
          entry_result?: string
          recommended_level?:
            | 'beginner'
            | 'elementary'
            | 'pre-intermediate'
            | 'intermediate'
            | 'upper-intermediate'
            | 'advanced'
            | 'proficient'
            | null
          decision_status?: 'pending' | 'accepted' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          email?: string | null
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
        Relationships: []
      }
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          class_type: 'ielts' | 'communication-english'
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.5-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
          status: 'active' | 'inactive' | 'suspended'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          class_type?: 'ielts' | 'communication-english'
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.5-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
          status?: 'active' | 'inactive' | 'suspended'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          class_type?: 'ielts' | 'communication-english'
          level?: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.5-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
          status?: 'active' | 'inactive' | 'suspended'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_teacher_assignments: {
        Row: {
          class_id: string
          teacher_id: string
          role: 'main-teacher' | 'teaching-assistant'
          created_at: string
        }
        Insert: {
          class_id: string
          teacher_id: string
          role: 'main-teacher' | 'teaching-assistant'
          created_at?: string
        }
        Update: {
          class_id?: string
          teacher_id?: string
          role?: 'main-teacher' | 'teaching-assistant'
          created_at?: string
        }
        Relationships: []
      }
      class_students: {
        Row: {
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          class_id: string
          title: string
          content: string | null
          start_time: string
          end_time: string
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          title: string
          content?: string | null
          start_time: string
          end_time: string
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          title?: string
          content?: string | null
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_attendance: {
        Row: {
          id: string
          lesson_id: string
          student_id: string
          status: 'present' | 'late' | 'absent_excused' | 'absent_unexcused'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          student_id: string
          status?: 'present' | 'late' | 'absent_excused' | 'absent_unexcused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          student_id?: string
          status?: 'present' | 'late' | 'absent_excused' | 'absent_unexcused'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          id: string
          class_id: string
          lesson_id: string | null
          type: 'in-class' | 'homework' | 'test'
          title: string
          max_score: number
          weight: number
          assigned_at: string
          due_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          lesson_id?: string | null
          type: 'in-class' | 'homework' | 'test'
          title: string
          max_score?: number
          weight?: number
          assigned_at?: string
          due_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          lesson_id?: string | null
          type?: 'in-class' | 'homework' | 'test'
          title?: string
          max_score?: number
          weight?: number
          assigned_at?: string
          due_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_scores: {
        Row: {
          id: string
          assessment_id: string
          student_id: string
          score: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          student_id: string
          score?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          student_id?: string
          score?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_components: {
        Row: {
          id: string
          assessment_id: string
          title: string
          is_scorable: boolean
          max_score: number | null
          display_order: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          title: string
          is_scorable?: boolean
          max_score?: number | null
          display_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          title?: string
          is_scorable?: boolean
          max_score?: number | null
          display_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_component_scores: {
        Row: {
          id: string
          component_id: string
          student_id: string
          score: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          component_id: string
          student_id: string
          score?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          component_id?: string
          student_id?: string
          score?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          user_role: 'admin' | 'teacher'
          title: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_role: 'admin' | 'teacher'
          title: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_role?: 'admin' | 'teacher'
          title?: string
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          role: 'admin' | 'teacher'
          teacher_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'admin' | 'teacher'
          teacher_id?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: 'admin' | 'teacher'
          teacher_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: false
            referencedRelation: 'teacher'
            referencedColumns: ['id']
          }
        ]
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
