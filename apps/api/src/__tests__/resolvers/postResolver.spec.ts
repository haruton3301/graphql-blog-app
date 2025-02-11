import { Post, PrismaClient, User } from "@prisma/client"
import { GraphQLError } from "graphql"
import { MyContext } from "../../context"
import { postResolvers } from "../../resolvers/postResolvers"
import { mockPosts } from "../mocks/post"
import { mockUsers } from "../mocks/user"
import { deleteAllData } from "../utils/prisma"
import { getUser } from "../utils/user"

const prisma = new PrismaClient()

let testUsers: Array<User> | null = null
let testPosts: Array<Post> | null = null

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await deleteAllData()

  await prisma.user.createMany({ data: mockUsers })
  testUsers = await prisma.user.findMany()
  await prisma.post.createMany({
    data: mockPosts.map((post, index) => ({
      ...post,
      authorId: testUsers![index].id,
    })),
  })
  testPosts = await prisma.post.findMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe("postResolvers", () => {
  describe("posts", () => {
    it("should return all posts", async () => {
      const response = await postResolvers.posts(null, {}, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(mockPosts.length)
    })

    it("should return posts matching searchTerm", async () => {
      const searchTerm = mockPosts[0].title

      const response = await postResolvers.posts(null, { searchTerm }, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(1)
      expect(response[0].title).toBe("Test post 1")
    })

    it("should return posts filtered by authorIdFilter", async () => {
      const filterUser = await getUser(prisma, mockUsers[0].email)
      const authorIdFilter = filterUser!.id

      const response = await postResolvers.posts(null, { authorIdFilter }, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(1)
      expect(response[0].authorId).toBe(authorIdFilter)
    })

    it("should return posts with likedByMe set correctly", async () => {
      await postResolvers.likePost(null, { postId: testPosts![0].id }, {
        userId: testUsers![0].id,
      } as MyContext)

      const response = await postResolvers.posts(
        null,
        {},
        { userId: testUsers![0].id },
      )

      expect(response[0].likedByMe).toBe(true)
      expect(response[1].likedByMe).toBe(false)
    })
  })

  describe("post", () => {
    it("should return a post by ID", async () => {
      const response = await postResolvers.post(
        null,
        { id: testPosts![0].id },
        {
          userId: null,
        } as MyContext,
      )

      expect(response.title).toBe(mockPosts[0].title)
      expect(response.content).toBe(mockPosts[0].content)
    })

    it("should return post with likedByMe set correctly", async () => {
      await postResolvers.likePost(null, { postId: testPosts![0].id }, {
        userId: testUsers![0].id,
      } as MyContext)

      const response = await postResolvers.post(
        null,
        { id: testPosts![0].id },
        { userId: testUsers![0].id },
      )

      expect(response.likedByMe).toBe(true)
    })

    it("should throw an error if post not found", async () => {
      await expect(
        postResolvers.post(null, { id: "non-existing-id" }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Post not found"))
    })
  })

  describe("createPost", () => {
    it("should create a new post for authenticated user", async () => {
      const title = "New Post"
      const content = "Content of new post"

      const response = await postResolvers.createPost(
        null,
        { title, content },
        { userId: testUsers![0].id } as MyContext,
      )

      const createdPost = await prisma.post.findUnique({
        where: { id: response.id },
      })

      expect(createdPost).not.toBeNull()
      expect(createdPost?.title).toBe(title)
      expect(createdPost?.content).toBe(content)
      expect(createdPost?.authorId).toBe(testUsers![0].id)
    })

    it("should throw an error if not authenticated", async () => {
      const title = "New Post"
      const content = "Content of new post"

      await expect(
        postResolvers.createPost(null, { title, content }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })

    it("should throw an error if input is empty", async () => {
      await expect(
        postResolvers.createPost(
          null,
          {} as any,
          { userId: testUsers![0].id } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Illegal arguments"))
    })
  })

  describe("likePost", () => {
    it("should like a post if not already liked and update likeCount", async () => {
      const initialPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })
      const initialLikeCount = initialPost!.likeCount

      const response = await postResolvers.likePost(
        null,
        { postId: testPosts![0].id },
        { userId: testUsers![0].id } as MyContext,
      )

      expect(response).toBe(true)

      const updatedPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })
      expect(updatedPost!.likeCount).toBe(initialLikeCount + 1)

      const like = await prisma.like.findUnique({
        where: {
          userId_postId: { userId: testUsers![0].id, postId: testPosts![0].id },
        },
      })
      expect(like).not.toBeNull()
    })

    it("should unlike a post if already liked and update likeCount", async () => {
      await prisma.like.create({
        data: { userId: testUsers![0].id, postId: testPosts![0].id },
      })

      const initialPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })
      const initialLikeCount = initialPost!.likeCount

      const response = await postResolvers.likePost(
        null,
        { postId: testPosts![0].id },
        { userId: testUsers![0].id } as MyContext,
      )

      expect(response).toBe(false)

      const updatedPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })
      expect(updatedPost!.likeCount).toBe(initialLikeCount - 1)

      const like = await prisma.like.findUnique({
        where: {
          userId_postId: { userId: testUsers![0].id, postId: testPosts![0].id },
        },
      })
      expect(like).toBeNull()
    })

    it("should throw an error if not authenticated", async () => {
      await expect(
        postResolvers.likePost(null, { postId: testPosts![0].id }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })
  })
})
