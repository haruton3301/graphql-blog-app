import { AuthLayout } from "@/components/layouts/AuthLayout"
import { LoginGuardLayout } from "@/components/layouts/LoginGuardLayout"
import { RootLayout } from "@/components/layouts/RootLayout"
import LoginPage from "@/pages/auth/login"
import RegisterPage from "@/pages/auth/register"
import HomePage from "@/pages/home"
import CreatePostPage from "@/pages/posts/create"
import EditPostPage from "@/pages/posts/edit"
import { Route, Routes } from "react-router-dom"
import { PostDetailPage } from "./pages/posts/detail"
import UsersIndexPage from "./pages/users"

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
          <Route path=":id">
            <Route index element={<PostDetailPage />} />
            <Route path="edit" element={<LoginGuardLayout />}>
              <Route index element={<EditPostPage />} />
            </Route>
          </Route>
          <Route path="create" element={<LoginGuardLayout />}>
            <Route index element={<CreatePostPage />} />
          </Route>
        </Route>
        <Route path="/users">
          <Route path=":id">
            <Route index element={<UsersIndexPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
