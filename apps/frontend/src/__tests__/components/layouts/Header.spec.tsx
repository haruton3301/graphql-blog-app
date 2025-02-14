import { Header } from "@/components/layouts/Header"
import { removeToken, setToken } from "@/libs/utils/localStorage"
import { mockToken, mockUser } from "@/mocks/data/auth"
import { AuthProvider } from "@/providers/auth"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"

const mockedUseNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const mod =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  }
})

const renderHeader = () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe("Header component", () => {
  beforeEach(() => {
    removeToken()
  })

  test("Should display login and register buttons when not logged in", async () => {
    renderHeader()

    await waitFor(() => {
      expect(screen.getByText("ログイン")).toBeInTheDocument()
      expect(screen.getByText("ユーザー登録")).toBeInTheDocument()
      expect(screen.queryByText("ログアウト")).toBeNull()
    })
  })

  test("Should display user name and logout button when logged in", async () => {
    setToken(mockToken)

    renderHeader()

    await waitFor(() => {
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText("ログアウト")).toBeInTheDocument()
      expect(screen.queryByText("ログイン")).toBeNull()
    })
  })

  test("Should log out when logout button is clicked", async () => {
    setToken(mockToken)

    renderHeader()

    await waitFor(() => {
      screen.getByText("ログアウト")
    })
    fireEvent.click(screen.getByText("ログアウト"))
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith("/auth/login")
    })
  })
})
