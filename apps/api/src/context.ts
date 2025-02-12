import { ContextFunction } from "@apollo/server"
import { ExpressContextFunctionArgument } from "@apollo/server/express4"
import jwt from "jsonwebtoken"
import { secrets } from "./libs/secrets"

export interface MyContext {
  userId: string | null
}

export const context: ContextFunction<
  [ExpressContextFunctionArgument],
  MyContext
> = async ({ req }) => {
  const auth = req.headers.authorization || ""
  const token = auth.split(" ")[1]
  try {
    const decoded = jwt.verify(token, secrets.JWT_SECRET)
    if (decoded && typeof decoded !== "string" && "userId" in decoded) {
      return { userId: decoded.userId }
    } else {
      return { userId: null }
    }
  } catch (e: any) {
    return { userId: null }
  }
}
