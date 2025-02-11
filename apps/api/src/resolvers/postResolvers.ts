import { GraphQLError } from "graphql"
import { MyContext } from "../context"
import { prisma } from "../libs/prisma"
import { requireAuth } from "./utils/auth"

export const postResolvers = {
  posts: async (
    _: any,
    {
      searchTerm,
      authorIdFilter,
    }: { searchTerm?: string; authorIdFilter?: string },
    context: MyContext,
  ) => {
    const userId = context.userId

    const whereConditions: any = {}

    if (searchTerm) {
      whereConditions.OR = [
        { title: { contains: searchTerm } },
        { content: { contains: searchTerm } },
      ]
    }

    if (authorIdFilter) {
      whereConditions.authorId = authorIdFilter
    }

    const posts = await prisma.post.findMany({
      where: whereConditions,
      include: { likes: true, author: true },
    })

    return posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      likedByMe: userId
        ? post.likes.some((like) => like.userId === userId)
        : false,
    }))
  },

  post: async (_: any, { id }: { id: string }, context: MyContext) => {
    const userId = context.userId

    const post = await prisma.post.findUnique({
      where: { id },
      include: { likes: true, author: true },
    })
    if (!post) throw new GraphQLError("Post not found")

    return {
      ...post,
      likeCount: post.likes.length,
      likedByMe: userId
        ? post.likes.some((like) => like.userId === userId)
        : false,
    }
  },

  createPost: async (
    _: any,
    { title, content }: { title: string; content: string },
    context: MyContext,
  ) => {
    const userId = requireAuth(context)

    if (!title || !content) {
      throw new GraphQLError("Illegal arguments")
    }

    return prisma.post.create({ data: { title, content, authorId: userId } })
  },

  likePost: async (
    _: any,
    { postId }: { postId: string },
    context: MyContext,
  ) => {
    const userId = requireAuth(context)

    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (like) {
      await prisma.like.delete({ where: { id: like.id } })
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      })
      return false
    } else {
      await prisma.like.create({ data: { userId, postId } })
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      })
      return true
    }
  },
}
