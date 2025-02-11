import { PrismaClient, User } from "@prisma/client"
import { GraphQLError } from "graphql"
import { MyContext } from "../../context"
import { userResolvers } from "../../resolvers/userResolvers"
import { mockUsers } from "../mocks/user"
import { deleteAllData } from "../utils/prisma"

const prisma = new PrismaClient()

let testUsers: Array<User> | null = null

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await deleteAllData()

  await prisma.user.createMany({ data: mockUsers })
  testUsers = await prisma.user.findMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe("userResolvers", () => {
  describe("me", () => {
    it("should return the user data", async () => {
      const response = await userResolvers.me(null, {}, {
        userId: testUsers![0].id,
      } as MyContext)

      expect(response).not.toBeNull()
      expect(response!.id).toBe(testUsers![0].id)
      expect(response!.email).toBe(testUsers![0].email)
    })

    it("should throw an error if not authenticated", async () => {
      await expect(
        userResolvers.me(null, {}, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })
  })
})
