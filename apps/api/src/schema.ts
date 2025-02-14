export const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    likeCount: Int!
    likedByMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    posts(searchTerm: String, userIdFilter: String): [Post!]!
    post(id: ID!): Post
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    createPost(title: String!, content: String!): Boolean!
    updatePost(postId: ID!, title: String, content: String): Boolean!
    deletePost(postId: ID!): Boolean!
    likePost(postId: ID!): Boolean!
  }
`
