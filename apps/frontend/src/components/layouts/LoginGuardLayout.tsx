import { useAuth } from "@/providers/auth"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export const LoginGuardLayout = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  return <Outlet />
}
