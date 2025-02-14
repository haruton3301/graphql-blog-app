import { removeToken, setToken } from "@/libs/utils/localStorage"
import { mockPassword, mockToken, mockUser } from "@/mocks/data/auth"
import { AuthProvider, useAuth } from "@/providers/auth"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

type TestComponentProps = {
  email: string
  password: string
}

const TestComponent = ({ email, password }: TestComponentProps) => {
  const { user, isLoggedIn, login, logout } = useAuth()

  const handleLogin = async () => {
    try {
      await login({ email, password })
    } catch (error) {
      console.error("Login failed")
    }
  }

  return (
    <div>
      <p data-testid="login-status">
        {isLoggedIn ? `Logged in as ${user?.email}` : "Not logged in"}
      </p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    removeToken()
  })

  test("Should initialize as logged out when no token is stored", async () => {
    render(
      <AuthProvider>
        <TestComponent email={mockUser.email} password={mockPassword} />
      </AuthProvider>,
    )

    expect(screen.getByTestId("login-status")).toHaveTextContent(
      "Not logged in",
    )
  })

  test("Should log in successfully with valid credentials", async () => {
    render(
      <AuthProvider>
        <TestComponent email={mockUser.email} password={mockPassword} />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(screen.getByTestId("login-status")).toHaveTextContent(
        `Logged in as ${mockUser.email}`,
      )
    })
  })

  test("Should fail login with invalid credentials", async () => {
    const invalidPassword = "invalid-password"

    render(
      <AuthProvider>
        <TestComponent email={mockUser.email} password={invalidPassword} />
      </AuthProvider>,
    )

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    fireEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Login failed"),
      )
    })
  })

  test("Should auto-login if token is stored", async () => {
    setToken(mockToken)

    render(
      <AuthProvider>
        <TestComponent email="" password="" />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("login-status")).toHaveTextContent(
        `Logged in as ${mockUser.email}`,
      )
    })
  })

  test("Should log out successfully", async () => {
    setToken(mockToken)

    render(
      <AuthProvider>
        <TestComponent email="" password="" />
      </AuthProvider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByText("Logout"))
    })

    await waitFor(() => {
      expect(screen.getByTestId("login-status")).toHaveTextContent(
        "Not logged in",
      )
    })
  })
})
