import { ContextFunction } from "@apollo/server"
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4"
import jwt from "jsonwebtoken"
import { secrets } from "./libs/secrets"

export interface MyContext {
  userId: string | null
}

export const context: ContextFunction<
  [ExpressContextFunctionArgument],
  MyContext
> = async ({ req }) => {
  const token = req.headers.authorization || ""
  try {
    const decoded = jwt.verify(token, secrets.JWT_SECRET)
    if (decoded && typeof decoded !== "string" && "userId" in decoded) {
      return { userId: decoded.userId }
    } else {
      return { userId: null }
    }
  } catch {
    return { userId: null }
  }
}
