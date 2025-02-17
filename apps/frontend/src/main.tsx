import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import App from "./App.tsx"
import "./index.css"
import { AuthProvider } from "./providers/auth.tsx"

if (import.meta.env.DEV && import.meta.env.VITE_MOCK_MODE === "true") {
  const { worker } = await import("@/mocks/setup/browser")
  await worker.start({ onUnhandledRequest: "bypass" })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
