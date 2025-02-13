import { ApolloError } from "@apollo/client"
import { authService } from "../../libs/services"
import { mockPassword, mockUser } from "../../mocks/data/auth"
import { server } from "../../mocks/setup/server"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("AuthService", () => {
  describe("Register", () => {
    const registerUser = {
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
    }

    it("should register a new user", async () => {
      const message = await authService.register(registerUser)
      expect(message).toBe("User registered successfully")
    })

    it("should throw error for invalid arguments", async () => {
      const invalidUser = {
        name: "",
        email: "",
        password: "",
      }
      await expect(authService.register(invalidUser)).rejects.toThrowError(
        ApolloError,
      )
      await expect(authService.register(invalidUser)).rejects.toThrowError(
        expect.objectContaining({
          message: expect.stringContaining("Illegal arguments"),
        }),
      )
    })

    it("should throw error for invalid email format", async () => {
      await expect(
        authService.register({ ...registerUser, email: "invalid-email" }),
      ).rejects.toThrowError(ApolloError)
      await expect(
        authService.register({ ...registerUser, email: "invalid-email" }),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: expect.stringContaining("Invalid email format"),
        }),
      )
    })

    it("should throw error for duplicate email", async () => {
      await expect(
        authService.register({ ...registerUser, email: "user@example.com" }),
      ).rejects.toThrowError(ApolloError)
      await expect(
        authService.register({ ...registerUser, email: "user@example.com" }),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: expect.stringContaining("Email already taken"),
        }),
      )
    })
  })

  describe("Login", () => {
    it("should login with an existing user", async () => {
      const loginParams = {
        email: mockUser.email,
        password: mockPassword,
      }
      const token = await authService.login(loginParams)
      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
    })

    it("should throw error for invalid arguments", async () => {
      const invalidParams = {
        email: "",
        password: "",
      }
      await expect(authService.login(invalidParams)).rejects.toThrowError(
        ApolloError,
      )
      await expect(authService.login(invalidParams)).rejects.toThrowError(
        expect.objectContaining({
          message: expect.stringContaining("Illegal arguments"),
        }),
      )
    })

    it("should not login with an incorrect password", async () => {
      const incorrectParams = {
        email: mockUser.email,
        password: "wrongpassword",
      }
      await expect(authService.login(incorrectParams)).rejects.toThrowError(
        ApolloError,
      )
      await expect(authService.login(incorrectParams)).rejects.toThrowError(
        expect.objectContaining({
          message: expect.stringContaining("Invalid credentials"),
        }),
      )
    })
  })
})
