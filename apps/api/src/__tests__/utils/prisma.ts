import { prisma } from "../../libs/prisma"

export const deleteAllData = async () => {
  await prisma.like.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
}
