import messages from "@/libs/constants/messages"
import { mockExistingUser, mockPassword, mockUser } from "@/mocks/data/auth"
import RegisterPage from "@/pages/auth/register"
import { AuthProvider } from "@/providers/auth"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

const renderRegisterPage = () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
        <ToastContainer />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe("RegisterPage", () => {
  it("should show error message for already taken email", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: mockExistingUser.name },
    })
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockExistingUser.email },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.emailAlreadyTakenMessage),
      ).toBeInTheDocument(),
    )
  })

  it("should show error message for missing name", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(screen.getByText(messages.requiredMessage)).toBeInTheDocument(),
    )
  })

  it("should show error message for missing email", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: mockUser.name },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(screen.getByText(messages.requiredMessage)).toBeInTheDocument(),
    )
  })

  it("should show error message for invalid email format", async () => {
    const invalidEmail = "invalid@email"

    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: mockUser.email },
    })
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: invalidEmail },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.emailInvalidFormtMessage),
      ).toBeInTheDocument(),
    )
  })

  it("should show error message for missing password", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: mockUser.name },
    })
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(screen.getByText(messages.requiredMessage)).toBeInTheDocument(),
    )
  })

  it("should register successfully", async () => {
    renderRegisterPage()

    fireEvent.change(screen.getByLabelText("ユーザー名"), {
      target: { value: mockUser.name },
    })
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: mockUser.email },
    })
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: mockPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: /登録/i }))

    await waitFor(() =>
      expect(
        screen.getByText(messages.registerSuccessfulMessage),
      ).toBeInTheDocument(),
    )
  })
})
