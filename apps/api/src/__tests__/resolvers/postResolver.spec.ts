import { Post, PrismaClient, User } from "@prisma/client"
import { GraphQLError } from "graphql"
import { MyContext } from "../../context"
import { postMutations } from "../../resolvers/post/mutations"
import { postQueries } from "../../resolvers/post/queries"
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
      const response = await postQueries.posts(null, {}, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(mockPosts.length)
    })

    it("should return posts matching searchTerm", async () => {
      const searchTerm = mockPosts[0].title

      const response = await postQueries.posts(null, { searchTerm }, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(1)
      expect(response[0].title).toBe("Test post 1")
    })

    it("should return posts filtered by authorIdFilter", async () => {
      const filterUser = await getUser(prisma, mockUsers[0].email)
      const authorIdFilter = filterUser!.id

      const response = await postQueries.posts(null, { authorIdFilter }, {
        userId: null,
      } as MyContext)

      expect(response.length).toBe(1)
      expect(response[0].authorId).toBe(authorIdFilter)
    })

    it("should return posts with likedByMe set correctly", async () => {
      await postMutations.likePost(null, { postId: testPosts![0].id }, {
        userId: testUsers![0].id,
      } as MyContext)

      const response = await postQueries.posts(
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
      const response = await postQueries.post(null, { id: testPosts![0].id }, {
        userId: null,
      } as MyContext)

      expect(response.title).toBe(mockPosts[0].title)
      expect(response.content).toBe(mockPosts[0].content)
    })

    it("should return post with likedByMe set correctly", async () => {
      await postMutations.likePost(null, { postId: testPosts![0].id }, {
        userId: testUsers![0].id,
      } as MyContext)

      const response = await postQueries.post(
        null,
        { id: testPosts![0].id },
        { userId: testUsers![0].id },
      )

      expect(response.likedByMe).toBe(true)
    })

    it("should throw an error if post not found", async () => {
      await expect(
        postQueries.post(null, { id: "non-existing-id" }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Post not found"))
    })
  })

  describe("createPost", () => {
    it("should create a new post for authenticated user", async () => {
      const title = "New Post"
      const content = "Content of new post"

      await postMutations.createPost(null, { title, content }, {
        userId: testUsers![0].id,
      } as MyContext)

      const createdPost = await prisma.post.findFirst({
        orderBy: { createdAt: "desc" },
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
        postMutations.createPost(null, { title, content }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })

    it("should throw an error if input is empty", async () => {
      await expect(
        postMutations.createPost(
          null,
          {} as any,
          { userId: testUsers![0].id } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Illegal arguments"))
    })
  })

  describe("updatePost", () => {
    it("should update a post for the authenticated owner", async () => {
      const newTitle = "Updated Title"
      const newContent = "Updated Content"

      await postMutations.updatePost(
        null,
        { postId: testPosts![0].id, title: newTitle, content: newContent },
        { userId: testUsers![0].id } as MyContext,
      )

      const updatedPost = await prisma.post.findFirst({
        orderBy: { updatedAt: "desc" },
      })

      expect(updatedPost).not.toBeNull()
      expect(updatedPost?.title).toBe(newTitle)
      expect(updatedPost?.content).toBe(newContent)
    })

    it("should throw an error if not authenticated", async () => {
      await expect(
        postMutations.updatePost(
          null,
          {
            postId: testPosts![0].id,
            title: "New Title",
            content: "New Content",
          },
          { userId: null } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })

    it("should throw an error if the post does not exist", async () => {
      await expect(
        postMutations.updatePost(
          null,
          {
            postId: "non-existenting-id",
            title: "New Title",
            content: "New Content",
          },
          { userId: testUsers![0].id } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Post not found"))
    })

    it("should throw an error if the user is not the owner", async () => {
      await expect(
        postMutations.updatePost(
          null,
          {
            postId: testPosts![0].id,
            title: "New Title",
            content: "New Content",
          },
          { userId: testUsers![1].id } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Unauthorized"))
    })

    it("should throw an error if input is empty", async () => {
      await expect(
        postMutations.updatePost(
          null,
          { postId: testPosts![0].id, title: "", content: "" },
          { userId: testUsers![0].id } as MyContext,
        ),
      ).rejects.toThrowError(new GraphQLError("Illegal arguments"))
    })
  })

  describe("deletePost", () => {
    it("should delete a post for the authenticated owner", async () => {
      const response = await postMutations.deletePost(
        null,
        { postId: testPosts![0].id },
        { userId: testUsers![0].id } as MyContext,
      )

      expect(response).toBe(true)

      const deletedPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })

      expect(deletedPost).toBeNull()
    })

    it("should throw an error if not authenticated", async () => {
      await expect(
        postMutations.deletePost(null, { postId: testPosts![0].id }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })

    it("should throw an error if the post does not exist", async () => {
      await expect(
        postMutations.deletePost(null, { postId: "nonexistent-id" }, {
          userId: testUsers![0].id,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Post not found"))
    })

    it("should throw an error if the user is not the owner", async () => {
      await expect(
        postMutations.deletePost(null, { postId: testPosts![0].id }, {
          userId: testUsers![1].id,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Unauthorized"))
    })
  })

  describe("likePost", () => {
    it("should like a post if not already liked and update likeCount", async () => {
      const initialPost = await prisma.post.findUnique({
        where: { id: testPosts![0].id },
      })
      const initialLikeCount = initialPost!.likeCount

      const response = await postMutations.likePost(
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

      const response = await postMutations.likePost(
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
        postMutations.likePost(null, { postId: testPosts![0].id }, {
          userId: null,
        } as MyContext),
      ).rejects.toThrowError(new GraphQLError("Authentication required"))
    })
  })
})
