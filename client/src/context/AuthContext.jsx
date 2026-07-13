import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on initial load
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfile({
        full_name: currentUser.email.split('@')[0], // Placeholder since we don't store full_name in the DB yet
        email: currentUser.email,
        avatar_url: ''
      })
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    const user = await authService.login(email, password)
    setUser(user)
    setProfile({
      full_name: user.email.split('@')[0],
      email: user.email,
      avatar_url: ''
    })
    return user
  }

  const signUp = async (email, password, fullName) => {
    const user = await authService.register(email, password)
    setUser(user)
    setProfile({
      full_name: fullName || user.email.split('@')[0],
      email: user.email,
      avatar_url: ''
    })
    return user
  }

  const signOut = async () => {
    authService.logout()
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    // We don't have a backend endpoint for this yet in our custom auth, 
    // so we just update the local state for now.
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
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
