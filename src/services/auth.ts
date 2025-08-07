import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    full_name?: string
    avatar_url?: string
    phone?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  full_name?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
  bio?: string
  phone?: string
}

class AuthService {
  // Sign up with email and password
  async signUp({ email, password, full_name, phone }: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone,
          }
        }
      })

      if (error) throw error

      // Create profile after successful signup
      if (data.user) {
        await this.createProfile(data.user.id, { full_name, phone })
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with email and password
  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with OTP
  async signInWithOTP(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with phone OTP
  async signInWithPhoneOTP(phone: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Verify OTP
  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return {
        ...user,
        profile
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Error getting current session:', error)
      return null
    }
  }

  // Create user profile
  private async createProfile(userId: string, data: { full_name?: string; phone?: string }) {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: data.full_name,
          phone: data.phone
        })

      if (error) throw error
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: UpdateProfileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Upload avatar
  async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl })

      return { data: publicUrl, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update password
  async updatePassword(password: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()