import {
  CreatePostDocument,
  DeletePostDocument,
  LikePostDocument,
  UpdatePostDocument,
} from "../graphql/mutations/post"
import { PostDocument, PostsDocument } from "../graphql/queries/post"
import {
  MutationCreatePostArgs,
  MutationDeletePostArgs,
  MutationLikePostArgs,
  MutationUpdatePostArgs,
  QueryPostArgs,
  QueryPostsArgs,
} from "../graphql/types"
import { Post } from "../types/post"
import { client } from "./client"

export class PostService {
  async create(params: MutationCreatePostArgs): Promise<Boolean> {
    const response = await client.mutate({
      mutation: CreatePostDocument,
      variables: params,
    })

    return response.data?.createPost
  }

  async update(params: MutationUpdatePostArgs): Promise<Boolean> {
    const response = await client.mutate({
      mutation: UpdatePostDocument,
      variables: params,
    })

    return response.data?.updatePost
  }

  async delete(params: MutationDeletePostArgs): Promise<boolean> {
    const response = await client.mutate({
      mutation: DeletePostDocument,
      variables: params,
    })

    return response.data?.deletePost ?? false
  }

  async like(params: MutationLikePostArgs): Promise<boolean> {
    const response = await client.mutate({
      mutation: LikePostDocument,
      variables: params,
    })

    return response.data?.likePost ?? false
  }

  async get(params: QueryPostArgs): Promise<Post | null> {
    const response = await client.query({
      query: PostDocument,
      variables: params,
    })

    return response.data?.post ?? null
  }

  async list(params?: QueryPostsArgs): Promise<Post[]> {
    const response = await client.query({
      query: PostsDocument,
      variables: params,
    })

    return response.data?.posts ?? []
  }
}
