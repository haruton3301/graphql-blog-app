import { authService, userService } from "@/libs/services"
import { removeToken, setToken } from "@/libs/utils/localStorage"
import { mockPassword, mockUser } from "@/mocks/data/auth"
import { ApolloError } from "@apollo/client"

afterEach(() => {
  removeToken()
})

describe("UserService", () => {
  it("should fetch the current user", async () => {
    const token = await authService.login({
      email: mockUser.email,
      password: mockPassword,
    })
    setToken(token)
    const user = await userService.me()
    expect(user?.name).toBe(mockUser.name)
    expect(user?.email).toBe(mockUser.email)
  })

  it("should throw an error when the token is invalid", async () => {
    setToken("invalid-token")
    await expect(userService.me()).rejects.toThrowError(ApolloError)
    await expect(userService.me()).rejects.toThrowError(
      expect.objectContaining({
        message: expect.stringContaining("Authentication required"),
      }),
    )
  })
})
