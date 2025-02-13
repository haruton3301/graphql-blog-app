import Loader from "@/components/common/Loader"
import { client } from "@/libs/services/client"
import { User } from "@/libs/types/user"
import { getToken, removeToken, setToken } from "@/libs/utils/localStorage"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, userService } from "../libs/services"

interface LoginParams {
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: ({ email, password }: LoginParams) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error("Token is not stored")
        }
        const userData = await userService.me()
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        logout()
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [])

  const login = async ({ email, password }: LoginParams) => {
    const token = await authService.login({ email, password })
    setToken(token)
    const userData = await userService.me()
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsLoggedIn(false)
    client.clearStore()
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {isLoading ? <Loader /> : <>{children}</>}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)!
