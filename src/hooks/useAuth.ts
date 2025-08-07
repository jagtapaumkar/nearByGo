import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService, type AuthUser } from '../services/auth'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (data: { email: string; password: string; full_name?: string; phone?: string }) => Promise<any>
  signIn: (data: { email: string; password: string }) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (updates: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const session = await authService.getCurrentSession()
      setSession(session)
      
      if (session?.user) {
        const user = await authService.getCurrentUser()
        setUser(user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          const user = await authService.getCurrentUser()
          setUser(user)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data: { email: string; password: string; full_name?: string; phone?: string }) => {
    setLoading(true)
    try {
      const result = await authService.signUp(data)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data: { email: string; password: string }) => {
    setLoading(true)
    try {
      const result = await authService.signIn(data)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await authService.signOut()
      return result
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in')
    
    setLoading(true)
    try {
      const result = await authService.updateProfile(user.id, updates)
      if (result.data) {
        setUser({ ...user, profile: { ...user.profile, ...updates } })
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}

export { AuthContext }