import { supabase } from '@/lib/supabase'
import type { AuthUser, UserRole } from '@/types/auth'

export type SendOtpResult = {
  mode: 'login' | 'signup'
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role, teacher_id')
      .eq('user_id', data.user.id)
      .single()

    if (roleError) throw new Error('No role assigned to this account. Please ask an administrator to assign your role in the user_roles table.')

    return {
      id: data.user.id,
      email: data.user.email!,
      role: roleData.role as UserRole,
      teacherId: roleData.teacher_id ?? undefined,
    }
  },

  // Sends a 6-digit OTP code via email.
  // Requires "Enable Email OTP" to be turned ON in Supabase Auth settings
  // (Auth → Configuration → Email). Without that setting, Supabase falls
  // back to sending a magic link instead of a numeric code.
  async sendOtp(email: string): Promise<SendOtpResult> {
    const normalizedEmail = email.trim().toLowerCase()

    const { data: exists, error: existsError } = await (supabase as any).rpc('auth_user_exists', {
      email_input: normalizedEmail,
    })

    if (existsError) throw existsError

    const userExists = Boolean(exists)

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: !userExists,
        // No emailRedirectTo — we verify the code manually, not via a link
      },
    })
    if (error) throw error

    return { mode: userExists ? 'login' : 'signup' }
  },

  async verifyOtp(email: string, token: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    if (!data.user) throw new Error('Verification failed')

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role, teacher_id')
      .eq('user_id', data.user.id)
      .single()

    if (roleError) throw new Error('No role assigned to this account. Please ask an admin to assign you a role.')

    return {
      id: data.user.id,
      email: data.user.email!,
      role: roleData.role as UserRole,
      teacherId: roleData.teacher_id ?? undefined,
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role, teacher_id')
      .eq('user_id', user.id)
      .single()

    if (error) return null

    return {
      id: user.id,
      email: user.email!,
      role: roleData.role as UserRole,
      teacherId: roleData.teacher_id ?? undefined,
    }
  },
}
