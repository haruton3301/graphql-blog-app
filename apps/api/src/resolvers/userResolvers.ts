import { PrismaClient } from "@prisma/client"
import { MyContext } from "../context"
import { requireAuth } from "./utils/auth"

const prisma = new PrismaClient()

export const userResolvers = {
  me: async (_: any, __: any, context: MyContext) => {
    const userId = requireAuth(context)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return user
  },
}
