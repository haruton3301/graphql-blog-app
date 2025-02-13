import { graphql, HttpResponse, RequestHandler } from "msw"
import { mockToken, mockUser } from "../data/auth"

export const userGraphQLHandlers: RequestHandler[] = [
  graphql.query("Me", async ({ request }) => {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || authHeader !== `Bearer ${mockToken}`) {
      return HttpResponse.json({
        errors: [{ message: "Authentication required" }],
      })
    }

    return HttpResponse.json({
      data: { me: mockUser },
    })
  }),
]
