'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

export interface AuthUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: 'user' | 'technician'
  provider: 'google' | 'credentials'
  company?: string
  department?: string
  skills?: string[]
  experience?: string
}

export interface DemoGoogleAccount {
  name: string
  firstName: string
  lastName: string
  email: string
  avatar: string
  role: 'user' | 'technician'
}

export const DEMO_GOOGLE_ACCOUNTS: DemoGoogleAccount[] = [
  {
    name: 'Arjun Patel',
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun.patel@servicesync.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'user',
  },
  {
    name: 'Maya Ortiz',
    firstName: 'Maya',
    lastName: 'Ortiz',
    email: 'maya.ortiz@servicesync.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    role: 'technician',
  },
  {
    name: 'David Miller',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'user',
  },
]

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isGoogleConfigured: boolean
  isSupabaseConfigured: boolean
  googleClientId: string | null
  isModalOpen: boolean
  modalRole: 'user' | 'technician'
  modalMode: 'signin' | 'signup'
  openGoogleAuth: (
    role: 'user' | 'technician',
    mode?: 'signin' | 'signup',
    onSuccess?: (user: AuthUser) => void,
  ) => Promise<void>
  closeModal: () => void
  selectAccount: (account: Partial<AuthUser>) => void
  loginWithCredentials: (email: string, role: 'user' | 'technician', name?: string, password?: string) => Promise<AuthUser>
  signUpWithCredentials: (params: {
    email: string
    password?: string
    role: 'user' | 'technician'
    name?: string
    company?: string
    department?: string
    skills?: string[]
    experience?: string
  }) => Promise<{ user?: AuthUser; error?: string }>
  logout: () => Promise<void>
  setAuthenticatedUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'servicesync_auth_user'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: string }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
        id?: {
          initialize: (config: Record<string, unknown>) => void
          prompt: () => void
        }
      }
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal state for fallback Google account picker
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalRole, setModalRole] = useState<'user' | 'technician'>('user')
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin')
  const successCallbackRef = useRef<((user: AuthUser) => void) | null>(null)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || null
  const isGoogleConfigured = Boolean(
    googleClientId && googleClientId.trim() !== '' && !googleClientId.includes('your-google-client-id'),
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
      supabaseKey &&
      supabaseUrl.trim() !== '' &&
      !supabaseUrl.includes('your-project-id') &&
      supabaseKey.trim() !== '' &&
      !supabaseKey.includes('your-supabase-anon-key'),
  )

  const setAuthenticatedUser = useCallback((newUser: AuthUser | null) => {
    setUser(newUser)
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.warn('Failed to persist auth state:', e)
    }
  }, [])

  // Listen to Supabase auth or restore stored session
  useEffect(() => {
    if (isSupabaseConfigured) {
      const supabase = createSupabaseClient()
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const u = session.user
            const meta = u.user_metadata || {}
            const authUser: AuthUser = {
              id: u.id,
              name: meta.full_name || meta.name || 'User',
              firstName: meta.first_name || (meta.full_name || meta.name || 'User').split(' ')[0],
              lastName: meta.last_name || '',
              email: u.email || '',
              avatar: meta.avatar_url || meta.picture,
              role: meta.role || 'user',
              provider: u.app_metadata?.provider === 'google' ? 'google' : 'credentials',
              company: meta.company,
              department: meta.department,
              skills: meta.skills,
              experience: meta.experience,
            }
            setUser(authUser)
          }
          setLoading(false)
        })

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const u = session.user
            const meta = u.user_metadata || {}
            const authUser: AuthUser = {
              id: u.id,
              name: meta.full_name || meta.name || 'User',
              firstName: meta.first_name || (meta.full_name || meta.name || 'User').split(' ')[0],
              lastName: meta.last_name || '',
              email: u.email || '',
              avatar: meta.avatar_url || meta.picture,
              role: meta.role || 'user',
              provider: u.app_metadata?.provider === 'google' ? 'google' : 'credentials',
              company: meta.company,
              department: meta.department,
              skills: meta.skills,
              experience: meta.experience,
            }
            setAuthenticatedUser(authUser)
          } else {
            setAuthenticatedUser(null)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      }
    }

    // Fallback: restore from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to parse stored user:', e)
    } finally {
      setLoading(false)
    }
  }, [isSupabaseConfigured, setAuthenticatedUser])

  // Load GIS script dynamically if configured
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (document.getElementById('google-gsi-client')) return

    const script = document.createElement('script')
    script.id = 'google-gsi-client'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const selectAccount = useCallback(
    (accountData: Partial<AuthUser>) => {
      const role = accountData.role || modalRole
      const name = accountData.name || 'User'
      const firstName = accountData.firstName || name.split(' ')[0] || 'User'
      const lastName = accountData.lastName || name.split(' ').slice(1).join(' ') || ''
      const email = accountData.email || `${firstName.toLowerCase()}@servicesync.io`

      const authUser: AuthUser = {
        id: accountData.id || `google_${Date.now()}`,
        name,
        firstName,
        lastName,
        email,
        avatar: accountData.avatar,
        role,
        provider: 'google',
        company: accountData.company,
        department: accountData.department,
        skills: accountData.skills,
        experience: accountData.experience,
      }

      setAuthenticatedUser(authUser)
      setIsModalOpen(false)

      if (successCallbackRef.current) {
        successCallbackRef.current(authUser)
        successCallbackRef.current = null
      }
    },
    [modalRole, setAuthenticatedUser],
  )

  const openGoogleAuth = useCallback(
    async (
      role: 'user' | 'technician',
      mode: 'signin' | 'signup' = 'signin',
      onSuccess?: (user: AuthUser) => void,
    ) => {
      setModalRole(role)
      setModalMode(mode)
      successCallbackRef.current = onSuccess || null

      // If Supabase is configured, use official Supabase OAuth with Google
      if (isSupabaseConfigured) {
        const supabase = createSupabaseClient()
        if (supabase) {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          })
          if (error) {
            console.error('Supabase Google OAuth error:', error.message)
            setIsModalOpen(true)
          }
          return
        }
      }

      // If standalone Google Client ID is configured, trigger direct GIS OAuth
      if (isGoogleConfigured && googleClientId && window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'openid email profile',
            callback: async (tokenResponse) => {
              if (tokenResponse?.error) {
                console.error('Google OAuth error:', tokenResponse.error)
                setIsModalOpen(true)
                return
              }

              if (tokenResponse?.access_token) {
                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  })
                  const data = await res.json()
                  const authUser: AuthUser = {
                    id: data.sub || `google_${Date.now()}`,
                    name: data.name || `${data.given_name || 'User'} ${data.family_name || ''}`.trim(),
                    firstName: data.given_name || data.name?.split(' ')[0] || 'User',
                    lastName: data.family_name || data.name?.split(' ').slice(1).join(' ') || '',
                    email: data.email,
                    avatar: data.picture,
                    role,
                    provider: 'google',
                  }

                  setAuthenticatedUser(authUser)
                  if (onSuccess) {
                    onSuccess(authUser)
                  }
                } catch (fetchErr) {
                  console.error('Failed to retrieve user profile:', fetchErr)
                  setIsModalOpen(true)
                }
              }
            },
          })
          client.requestAccessToken()
          return
        } catch (initErr) {
          console.warn('Google client init failed:', initErr)
          setIsModalOpen(true)
        }
      } else {
        // Fallback: interactive Google account chooser modal
        setIsModalOpen(true)
      }
    },
    [googleClientId, isGoogleConfigured, isSupabaseConfigured, setAuthenticatedUser],
  )

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    successCallbackRef.current = null
  }, [])

  const loginWithCredentials = useCallback(
    async (
      email: string,
      role: 'user' | 'technician',
      name?: string,
      password?: string,
    ): Promise<AuthUser> => {
      if (isSupabaseConfigured && password) {
        const supabase = createSupabaseClient()
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) {
            console.warn('Supabase credentials login error:', error.message)
          } else if (data?.user) {
            const u = data.user
            const meta = u.user_metadata || {}
            const authUser: AuthUser = {
              id: u.id,
              name: meta.full_name || meta.name || name || 'User',
              firstName: meta.first_name || (meta.full_name || meta.name || name || 'User').split(' ')[0],
              lastName: meta.last_name || '',
              email: u.email || email,
              role,
              provider: 'credentials',
            }
            setAuthenticatedUser(authUser)
            return authUser
          }
        }
      }

      // Local / Mock login
      const derivedName = name || email.split('@')[0].replace(/[._]/g, ' ')
      const firstName = derivedName.split(' ')[0]
      const capitalizedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1)
      const lastName = derivedName.split(' ').slice(1).join(' ')
      const capitalizedLast = lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : ''

      const authUser: AuthUser = {
        id: `cred_${Date.now()}`,
        name: `${capitalizedFirst} ${capitalizedLast}`.trim(),
        firstName: capitalizedFirst,
        lastName: capitalizedLast,
        email,
        role,
        provider: 'credentials',
      }

      setAuthenticatedUser(authUser)
      return authUser
    },
    [isSupabaseConfigured, setAuthenticatedUser],
  )

  const signUpWithCredentials = useCallback(
    async (params: {
      email: string
      password?: string
      role: 'user' | 'technician'
      name?: string
      company?: string
      department?: string
      skills?: string[]
      experience?: string
    }): Promise<{ user?: AuthUser; error?: string }> => {
      const { email, password, role, name, company, department, skills, experience } = params

      if (isSupabaseConfigured && password) {
        const supabase = createSupabaseClient()
        if (supabase) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                full_name: name,
                company,
                department,
                skills,
                experience,
              },
            },
          })

          if (error) {
            return { error: error.message }
          }

          if (data?.user) {
            const u = data.user
            const authUser: AuthUser = {
              id: u.id,
              name: name || 'User',
              firstName: name?.split(' ')[0] || 'User',
              lastName: name?.split(' ').slice(1).join(' ') || '',
              email,
              role,
              provider: 'credentials',
              company,
              department,
              skills,
              experience,
            }
            setAuthenticatedUser(authUser)
            return { user: authUser }
          }
        }
      }

      // Local fallback
      const authUser = await loginWithCredentials(email, role, name)
      return { user: authUser }
    },
    [isSupabaseConfigured, loginWithCredentials, setAuthenticatedUser],
  )

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      const supabase = createSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    }
    setAuthenticatedUser(null)
  }, [isSupabaseConfigured, setAuthenticatedUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGoogleConfigured,
        isSupabaseConfigured,
        googleClientId,
        isModalOpen,
        modalRole,
        modalMode,
        openGoogleAuth,
        closeModal,
        selectAccount,
        loginWithCredentials,
        signUpWithCredentials,
        logout,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
