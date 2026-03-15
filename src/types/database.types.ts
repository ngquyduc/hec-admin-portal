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
      parents: {
        Row: {
          id: string
          first_name: string
          last_name: string
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
          first_name: string
          last_name: string
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
          first_name?: string
          last_name?: string
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
      staff: {
        Row: {
          id: string
          first_name: string
          last_name: string
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
          first_name: string
          last_name: string
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
          first_name?: string
          last_name?: string
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
        Relationships: []
      }
      students: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string
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
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          date_of_birth: string
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
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string
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
        Relationships: [
          {
            foreignKeyName: 'students_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'parents'
            referencedColumns: ['id']
          }
        ]
      }
      teachers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          subjects: ('general-english' | 'business-english' | 'ielts' | 'toefl' | 'toeic' | 'kids-english' | 'conversation')[]
          hire_date: string
          hourly_rate: number
          status: 'active' | 'inactive' | 'suspended'
          address: string | null
          emergency_contact: string | null
          qualifications: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          subjects: ('general-english' | 'business-english' | 'ielts' | 'toefl' | 'toeic' | 'kids-english' | 'conversation')[]
          hire_date: string
          hourly_rate: number
          status?: 'active' | 'inactive' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          qualifications?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          subjects?: ('general-english' | 'business-english' | 'ielts' | 'toefl' | 'toeic' | 'kids-english' | 'conversation')[]
          hire_date?: string
          hourly_rate?: number
          status?: 'active' | 'inactive' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          qualifications?: string | null
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
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.0-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
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
          level: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.0-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
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
          level?: 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'pre-ielts' | '3.0-4.5' | '4.5-5.5' | '5.5-6.5' | '6.5-7.0+'
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
        Relationships: [
          {
            foreignKeyName: 'class_teacher_assignments_class_id_fkey'
            columns: ['class_id']
            isOneToOne: false
            referencedRelation: 'classes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'class_teacher_assignments_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: false
            referencedRelation: 'teachers'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'class_students_class_id_fkey'
            columns: ['class_id']
            isOneToOne: false
            referencedRelation: 'classes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'class_students_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'lessons_class_id_fkey'
            columns: ['class_id']
            isOneToOne: false
            referencedRelation: 'classes'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'lesson_attendance_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lesson_attendance_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      lesson_grades: {
        Row: {
          id: string
          lesson_id: string
          student_id: string
          score: number | null
          max_score: number
          grade_type: 'homework' | 'quiz' | 'exercise' | 'participation'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          student_id: string
          score?: number | null
          max_score?: number
          grade_type: 'homework' | 'quiz' | 'exercise' | 'participation'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          student_id?: string
          score?: number | null
          max_score?: number
          grade_type?: 'homework' | 'quiz' | 'exercise' | 'participation'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lesson_grades_lesson_id_fkey'
            columns: ['lesson_id']
            isOneToOne: false
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lesson_grades_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      class_grades: {
        Row: {
          id: string
          class_id: string
          student_id: string
          period: 'midterm' | 'final' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
          score: number | null
          max_score: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          period: 'midterm' | 'final' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
          score?: number | null
          max_score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          period?: 'midterm' | 'final' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
          score?: number | null
          max_score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'class_grades_class_id_fkey'
            columns: ['class_id']
            isOneToOne: false
            referencedRelation: 'classes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'class_grades_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
