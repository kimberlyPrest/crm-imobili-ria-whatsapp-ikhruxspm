import React, { createContext, useContext } from 'react'
import { User } from '@/types/types'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('crm_user', null)

  const login = async (email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ id: '1', email, role: 'admin', name: 'Administrador' })
        resolve()
      }, 1000)
    })
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
