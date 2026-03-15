import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { CreateFeedback, Feedback } from '@/types/entities'

type FeedbackRow = Database['public']['Tables']['feedback']['Row']
type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']

function transformFeedbackRow(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    userId: row.user_id,
    userRole: row.user_role,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
  }
}

function transformCreateFeedback(data: CreateFeedback): FeedbackInsert {
  return {
    user_id: data.userId,
    user_role: data.userRole,
    title: data.title,
    message: data.message,
  }
}

export const feedbackService = {
  async create(feedback: CreateFeedback): Promise<Feedback> {
    const { data, error } = await supabase
      .from('feedback')
      .insert(transformCreateFeedback(feedback))
      .select()
      .single()

    if (error) throw error
    return transformFeedbackRow(data)
  },

  async getByUserId(userId: string): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(transformFeedbackRow)
  },
}
