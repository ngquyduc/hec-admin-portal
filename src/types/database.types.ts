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
          first_name: string
          last_name: string
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
          first_name?: string
          last_name?: string
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
