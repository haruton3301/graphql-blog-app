import { gql } from "graphql-tag"

export const CreatePostDocument = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content)
  }
`

export const UpdatePostDocument = gql`
  mutation UpdatePost($postId: ID!, $title: String, $content: String) {
    updatePost(postId: $postId, title: $title, content: $content)
  }
`

export const DeletePostDocument = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

export const LikePostDocument = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId)
  }
`
