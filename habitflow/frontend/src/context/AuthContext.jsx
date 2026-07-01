import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('habitflow_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('habitflow_token')
    if (token) {
      authApi
        .getProfile()
        .then((profile) => setUser((prev) => ({ ...prev, ...profile })))
        .catch(() => {
          localStorage.removeItem('habitflow_token')
          localStorage.removeItem('habitflow_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const data = await authApi.login(credentials)
    persist(data)
    return data
  }

  const signup = async (payload) => {
    const data = await authApi.signup(payload)
    persist(data)
    return data
  }

  const persist = (data) => {
    localStorage.setItem('habitflow_token', data.token)
    const userData = { id: data.userId, username: data.username, email: data.email, fullName: data.fullName }
    localStorage.setItem('habitflow_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('habitflow_token')
    localStorage.removeItem('habitflow_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
