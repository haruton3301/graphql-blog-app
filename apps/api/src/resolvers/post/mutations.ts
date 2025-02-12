import { GraphQLError } from "graphql"
import { MyContext } from "../../context"
import { prisma } from "../../libs/prisma"
import { requireAuth } from "../utils/auth"

export const postMutations = {
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

  updatePost: async (
    _: any,
    {
      postId,
      title,
      content,
    }: { postId: string; title?: string; content?: string },
    context: MyContext,
  ) => {
    const userId = requireAuth(context)

    const existingPost = await prisma.post.findUnique({ where: { id: postId } })
    if (!existingPost) {
      throw new GraphQLError("Post not found")
    }
    if (existingPost.authorId !== userId) {
      throw new GraphQLError("Unauthorized")
    }

    if (!title || !content) {
      throw new GraphQLError("Illegal arguments")
    }

    return prisma.post.update({
      where: { id: postId },
      data: {
        title: title ?? existingPost.title,
        content: content ?? existingPost.content,
      },
    })
  },

  deletePost: async (
    _: any,
    { postId }: { postId: string },
    context: MyContext,
  ) => {
    const userId = requireAuth(context)

    const existingPost = await prisma.post.findUnique({ where: { id: postId } })
    if (!existingPost) {
      throw new GraphQLError("Post not found")
    }
    if (existingPost.authorId !== userId) {
      throw new GraphQLError("Unauthorized")
    }

    await prisma.post.delete({ where: { id: postId } })
    return true
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
