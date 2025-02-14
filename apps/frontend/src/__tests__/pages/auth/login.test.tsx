import messages from "@/libs/constants/messages"
import { mockPassword, mockUser } from "@/mocks/data/auth"
import LoginPage from "@/pages/auth/login"
import { AuthProvider } from "@/providers/auth"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

const renderLoginPage = () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
        <ToastContainer />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe("LoginPage", () => {
  it("should show error message for invalid credentials", async () => {
    const incorrectPassword = "invalid-password"
    renderLoginPage()

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: incorrectPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.invalidCredentialsMessage),
      ).toBeInTheDocument(),
    )
  })

  it("should show error message for missing email", async () => {
    renderLoginPage()

    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }))

    await waitFor(() =>
      expect(screen.getByText(messages.requiredMessage)).toBeInTheDocument(),
    )
  })

  it("should show error message for invalid email format", async () => {
    const invalidEmail = "invalid@email"
    renderLoginPage()

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: invalidEmail },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.emailInvalidFormtMessage),
      ).toBeInTheDocument(),
    )
  })

  it("should show error message for missing password", async () => {
    renderLoginPage()

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }))

    await waitFor(() =>
      expect(screen.getByText(messages.requiredMessage)).toBeInTheDocument(),
    )
  })

  it("should login successfully", async () => {
    renderLoginPage()

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /ログイン/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.loginSuccessfulMessage),
      ).toBeInTheDocument(),
    )
  })
})
