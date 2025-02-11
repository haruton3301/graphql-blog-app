import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import { prisma } from "../libs/prisma"
import { secrets } from "../libs/secrets"
import { authResolvers } from "../resolvers/authResolvers"
import { mockUsers } from "./mocks/user"
import { deleteAllData } from "./utils/prisma"

const mockUser = mockUsers[0]

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await deleteAllData()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe("authResolvers", () => {
  describe("register", () => {
    it("should register a new user successfully", async () => {
      const response = await authResolvers.register(null, mockUser)

      const user = await prisma.user.findUnique({
        where: { email: mockUser.email },
      })

      expect(user).not.toBeNull()
      expect(user?.name).toBe(mockUser.name)
      expect(user?.email).toBe(mockUser.email)
      expect(response).toBe("User registered successfully")
    })

    it("should throw an error if input is empty", async () => {
      await expect(
        authResolvers.register(null, {} as any),
      ).rejects.toThrowError(new GraphQLError("Illegal arguments"))
    })

    it("should throw an error if email format is invalid", async () => {
      await expect(
        authResolvers.register(null, {
          name: mockUser.name,
          email: "invalid-email",
          password: mockUser.name,
        }),
      ).rejects.toThrowError(new GraphQLError("Invalid email format"))
    })

    it("should throw an error if email is already taken", async () => {
      await authResolvers.register(null, mockUser)

      await expect(authResolvers.register(null, mockUser)).rejects.toThrowError(
        new GraphQLError("Email already taken"),
      )
    })
  })

  describe("login", () => {
    it("should return a JWT token for valid credentials", async () => {
      await prisma.user.create({
        data: {
          name: mockUser.name,
          email: mockUser.email,
          password: await bcrypt.hash(mockUser.password, 10),
        },
      })

      const response = await authResolvers.login(null, {
        email: mockUser.email,
        password: mockUser.password,
      })

      expect(jwt.verify(response, secrets.JWT_SECRET)).toBeTruthy()
    })

    it("should throw an error if input is empty", async () => {
      await expect(authResolvers.login(null, {} as any)).rejects.toThrowError(
        new GraphQLError("Illegal arguments"),
      )
    })

    it("should throw an error for invalid credentials", async () => {
      await prisma.user.create({
        data: {
          name: mockUser.name,
          email: mockUser.email,
          password: await bcrypt.hash(mockUser.password, 10),
        },
      })

      await expect(
        authResolvers.login(null, {
          email: mockUser.email,
          password: "wrongPassword",
        }),
      ).rejects.toThrowError(new GraphQLError("Invalid credentials"))
    })
  })
})
