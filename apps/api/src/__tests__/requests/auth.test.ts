import request from "supertest"
import { describe, expect } from "vitest"
import { prisma } from "../../libs/prisma"
import { secrets } from "../../libs/secrets"
import { app, httpServer, startServer } from "../../server"
import { mockUsers } from "../mocks/user"
import { deleteAllData } from "../utils/prisma"

beforeAll(async () => {
  await startServer()
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: secrets.API_PORT }, resolve),
  )
  deleteAllData()
})

afterAll(async () => {
  httpServer.close()
  await prisma.$disconnect()
})

let global_token = ""
const mockUser = mockUsers[0]

describe("Auth Mutations", () => {
  const sendGraphQLRequest = async (
    query: string,
    variables: object,
    token?: string,
  ) => {
    const req = request(app)
      .post("/")
      .send({ query, variables })
      .set("Content-Type", "application/json")

    if (token) {
      req.set("Authorization", `Bearer ${token}`)
    }

    return await req
  }

  it("should register a new user", async () => {
    const response = await sendGraphQLRequest(
      `mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password)
      }`,
      mockUser,
    )

    expect(response.status).toBe(200)
    expect(response.body.data.register).toBe("User registered successfully")
  })

  it("should login an existing user", async () => {
    const response = await sendGraphQLRequest(
      `mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }`,
      {
        email: mockUser.email,
        password: mockUser.password,
      },
    )

    expect(response.status).toBe(200)
    const token = response.body.data.login
    expect(token).toBeDefined()

    global_token = token
  })

  it("should return the currently logged-in user", async () => {
    const response = await sendGraphQLRequest(
      `query Me {
        me {
          id
          name
          email
        }
      }`,
      {},
      global_token,
    )

    expect(response.status).toBe(200)
    expect(response.body.data.me).toBeDefined()
    expect(response.body.data.me.name).toBe(mockUser.name)
    expect(response.body.data.me.email).toBe(mockUser.email)
  })
})
