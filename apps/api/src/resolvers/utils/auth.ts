import { GraphQLError } from "graphql"
import { MyContext } from "../../context"

export const requireAuth = (context: MyContext) => {
  if (!context.userId) {
    throw new GraphQLError("Authentication required")
  }

  return context.userId
}
