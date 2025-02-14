export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type Mutation = {
  __typename?: "Mutation"
  createPost: Post
  deletePost: Scalars["Boolean"]["output"]
  likePost: Scalars["Boolean"]["output"]
  login: Scalars["String"]["output"]
  register: Scalars["String"]["output"]
  updatePost: Post
}

export type MutationCreatePostArgs = {
  content: Scalars["String"]["input"]
  title: Scalars["String"]["input"]
}

export type MutationDeletePostArgs = {
  postId: Scalars["ID"]["input"]
}

export type MutationLikePostArgs = {
  postId: Scalars["ID"]["input"]
}

export type MutationLoginArgs = {
  email: Scalars["String"]["input"]
  password: Scalars["String"]["input"]
}

export type MutationRegisterArgs = {
  email: Scalars["String"]["input"]
  name: Scalars["String"]["input"]
  password: Scalars["String"]["input"]
}

export type MutationUpdatePostArgs = {
  content?: InputMaybe<Scalars["String"]["input"]>
  postId: Scalars["ID"]["input"]
  title?: InputMaybe<Scalars["String"]["input"]>
}

export type Post = {
  __typename?: "Post"
  author: User
  content: Scalars["String"]["output"]
  createdAt: Scalars["String"]["output"]
  id: Scalars["ID"]["output"]
  likeCount: Scalars["Int"]["output"]
  likedByMe: Scalars["Boolean"]["output"]
  title: Scalars["String"]["output"]
  updatedAt: Scalars["String"]["output"]
}

export type Query = {
  __typename?: "Query"
  me?: Maybe<User>
  post?: Maybe<Post>
  posts: Array<Post>
}

export type QueryPostArgs = {
  id: Scalars["ID"]["input"]
}

export type QueryPostsArgs = {
  searchTerm?: InputMaybe<Scalars["String"]["input"]>
  userIdFilter?: InputMaybe<Scalars["String"]["input"]>
}

export type User = {
  __typename?: "User"
  email: Scalars["String"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
}

export type RegisterMutationVariables = Exact<{
  name: Scalars["String"]["input"]
  email: Scalars["String"]["input"]
  password: Scalars["String"]["input"]
}>

export type RegisterMutation = { __typename?: "Mutation"; register: string }

export type LoginMutationVariables = Exact<{
  email: Scalars["String"]["input"]
  password: Scalars["String"]["input"]
}>

export type LoginMutation = { __typename?: "Mutation"; login: string }

export type CreatePostMutationVariables = Exact<{
  title: Scalars["String"]["input"]
  content: Scalars["String"]["input"]
}>

export type CreatePostMutation = {
  __typename?: "Mutation"
  createPost: {
    __typename?: "Post"
    id: string
    title: string
    content: string
    likeCount: number
    likedByMe: boolean
    createdAt: string
    updatedAt: string
    author: { __typename?: "User"; id: string; name: string }
  }
}

export type UpdatePostMutationVariables = Exact<{
  postId: Scalars["ID"]["input"]
  title?: InputMaybe<Scalars["String"]["input"]>
  content?: InputMaybe<Scalars["String"]["input"]>
}>

export type UpdatePostMutation = {
  __typename?: "Mutation"
  updatePost: {
    __typename?: "Post"
    id: string
    title: string
    content: string
    updatedAt: string
  }
}

export type DeletePostMutationVariables = Exact<{
  postId: Scalars["ID"]["input"]
}>

export type DeletePostMutation = {
  __typename?: "Mutation"
  deletePost: boolean
}

export type LikePostMutationVariables = Exact<{
  postId: Scalars["ID"]["input"]
}>

export type LikePostMutation = { __typename?: "Mutation"; likePost: boolean }

export type GetPostsQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars["String"]["input"]>
  userIdFilter?: InputMaybe<Scalars["String"]["input"]>
}>

export type GetPostsQuery = {
  __typename?: "Query"
  posts: Array<{
    __typename?: "Post"
    id: string
    title: string
    content: string
    likeCount: number
    likedByMe: boolean
    createdAt: string
    updatedAt: string
    author: { __typename?: "User"; id: string; name: string }
  }>
}

export type GetPostQueryVariables = Exact<{
  id: Scalars["ID"]["input"]
}>

export type GetPostQuery = {
  __typename?: "Query"
  post?: {
    __typename?: "Post"
    id: string
    title: string
    content: string
    likeCount: number
    likedByMe: boolean
    createdAt: string
    updatedAt: string
    author: { __typename?: "User"; id: string; name: string }
  } | null
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: "Query"
  me?: { __typename?: "User"; id: string; name: string; email: string } | null
}
