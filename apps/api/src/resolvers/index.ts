import { authResolvers } from "./authResolvers"
import { postMutations } from "./post/mutations"
import { postQueries } from "./post/queries"
import { userResolvers } from "./userResolvers"

export const resolvers = {
  Query: {
    ...postQueries,
    ...userResolvers,
  },
  Mutation: {
    ...authResolvers,
    ...postMutations,
  },
}
