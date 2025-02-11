import { PrismaClient } from "@prisma/client"

export const getUser = async (prisma: PrismaClient, email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  })
}
