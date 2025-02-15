import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export const RootLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pb-6">
        <Outlet />
      </main>
    </>
  )
}
