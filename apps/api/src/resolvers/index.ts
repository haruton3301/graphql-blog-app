import { authResolvers } from "./authResolvers"
import { postResolvers } from "./postResolvers"
import { userResolvers } from "./userResolvers"

export const resolvers = {
  Query: {
    ...postResolvers,
    ...userResolvers,
  },
  Mutation: {
    ...authResolvers,
    ...postResolvers,
  },
}
