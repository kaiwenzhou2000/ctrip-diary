import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  userId: string
  setUserId: React.Dispatch<React.SetStateAction<string>>
  username: string
  setDataUsername: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [username, setDataUsername] = useState<string>('')

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userId, setUserId, username, setDataUsername }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
