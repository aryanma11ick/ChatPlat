"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import authService from "@/services/AuthService"

interface User {
  id: string
  username: string
  avatar?: string
  email?: string
  status?: "online" | "offline" | "away" | "busy"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, remember?: boolean) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing user session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("chatplat_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string, remember = false) => {
    setIsLoading(true)
    try {
      const userData = await authService.login(username, password)
      setUser(userData)

      // Store user data if remember me is checked
      if (remember) {
        localStorage.setItem("chatplat_user", JSON.stringify(userData))
      } else {
        // For session only
        sessionStorage.setItem("chatplat_user", JSON.stringify(userData))
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("chatplat_user")
    sessionStorage.removeItem("chatplat_user")
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    setIsLoading(true)
    try {
      const updatedUser = await authService.updateProfile(user.id, updates)
      setUser(updatedUser)

      // Update stored user data
      if (localStorage.getItem("chatplat_user")) {
        localStorage.setItem("chatplat_user", JSON.stringify(updatedUser))
      }
      if (sessionStorage.getItem("chatplat_user")) {
        sessionStorage.setItem("chatplat_user", JSON.stringify(updatedUser))
      }

      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
