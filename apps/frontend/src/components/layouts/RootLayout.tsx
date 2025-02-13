import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export const RootLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="bg-slate-100">
        <Outlet />
      </main>
    </>
  )
}
