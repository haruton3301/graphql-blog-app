import { graphql, HttpResponse, RequestHandler } from "msw"
import { mockPassword, mockUser } from "../data/auth"
import { isValidEmail } from "../utils/mail"
export const authGraphQLHandlers: RequestHandler[] = [
  graphql.mutation("Register", ({ variables }) => {
    const { name, email, password } = variables

    if (!name || !email || !password) {
      return HttpResponse.json({
        errors: [{ message: "Illegal arguments" }],
      })
    }

    if (!isValidEmail(email)) {
      return HttpResponse.json({
        errors: [{ message: "Invalid email format" }],
      })
    }

    if (email === mockUser.email) {
      return HttpResponse.json({
        errors: [{ message: "Email already taken" }],
      })
    }

    return HttpResponse.json({
      data: { register: "User registered successfully" },
    })
  }),

  graphql.mutation("Login", ({ variables }) => {
    const { email, password } = variables

    if (!email || !password) {
      return HttpResponse.json({
        errors: [{ message: "Illegal arguments" }],
      })
    }

    if (email !== mockUser.email || password !== mockPassword) {
      return HttpResponse.json({
        errors: [{ message: "Invalid credentials" }],
      })
    }

    return HttpResponse.json({
      data: {
        login: "fake-jwt-token",
      },
    })
  }),
]
