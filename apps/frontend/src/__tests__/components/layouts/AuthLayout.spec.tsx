import { mockedUseNavigate } from "@/__tests__/setup"
import { AuthLayout } from "@/components/layouts/AuthLayout"
import { removeToken, setToken } from "@/libs/utils/localStorage"
import { mockToken } from "@/mocks/data/auth"
import { AuthProvider } from "@/providers/auth"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

const renderAuthLayout = () => {
  render(
    <MemoryRouter initialEntries={["/auth"]}>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<div data-testid="child" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe("AuthLayout", () => {
  beforeEach(() => {
    removeToken()
  })

  test("Should render the outlet when not logged in", async () => {
    renderAuthLayout()

    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument()
    })
  })

  test("Should navigate to '/' when logged in", async () => {
    setToken(mockToken)
    renderAuthLayout()

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith("/")
    })
  })
})
