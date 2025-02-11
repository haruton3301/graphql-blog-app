import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import { prisma } from "../libs/prisma"
import { secrets } from "../libs/secrets"

export const authResolvers = {
  register: async (
    _: any,
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
  ) => {
    if (!name || !email || !password) {
      throw new GraphQLError("Illegal arguments")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new GraphQLError("Invalid email format")
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: { name, email, password: hashedPassword },
      })
      return "User registered successfully"
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new GraphQLError("Email already taken")
      }

      throw error
    }
  },

  login: async (
    _: any,
    { email, password }: { email: string; password: string },
  ) => {
    if (!email || !password) {
      throw new GraphQLError("Illegal arguments")
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new GraphQLError("Invalid credentials")
    return jwt.sign({ userId: user.id }, secrets.JWT_SECRET, {
      expiresIn: "7d",
    })
  },
}
