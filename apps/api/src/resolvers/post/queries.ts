import { GraphQLError } from "graphql"
import { MyContext } from "../../context"
import { prisma } from "../../libs/prisma"

export const postQueries = {
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
}
