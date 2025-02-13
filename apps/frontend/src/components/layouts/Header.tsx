import site from "@/libs/constants/site"
import { useAuth } from "@/providers/auth"
import { Link, useNavigate } from "react-router-dom"

export const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/auth/login")
  }

  return (
    <header className="w-full p-4 bg-white shadow-md">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">
          <Link to="/">{site.title}</Link>
        </h1>
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              <p>{user.name}</p>
              <button onClick={handleLogout} className="btn btn-primary">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/register" className="btn btn-primary">
                ユーザー登録
              </Link>
              <Link to="/auth/login" className="btn btn-primary">
                ログイン
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
