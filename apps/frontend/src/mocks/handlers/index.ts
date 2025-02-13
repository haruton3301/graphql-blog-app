import { RequestHandler } from "msw"
import { authGraphQLHandlers } from "./auth"
import { userGraphQLHandlers } from "./user"

export const mockEndPoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || ""

export const handlers: RequestHandler[] = [
  ...authGraphQLHandlers,
  ...userGraphQLHandlers,
]
