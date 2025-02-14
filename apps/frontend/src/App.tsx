import { AuthLayout } from "@/components/layouts/AuthLayout"
import { RootLayout } from "@/components/layouts/RootLayout"
import LoginPage from "@/pages/auth/login"
import RegisterPage from "@/pages/auth/register"
import HomePage from "@/pages/home"
import CreatePostPage from "@/pages/posts/create"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/posts">
          <Route path="create" element={<CreatePostPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
