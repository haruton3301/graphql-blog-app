import { gql } from "graphql-tag"

export const PostsDocument = gql`
  query Posts($searchTerm: String, $userIdFilter: String) {
    posts(searchTerm: $searchTerm, userIdFilter: $userIdFilter) {
      id
      title
      content
      author {
        id
        name
      }
      likeCount
      likedByMe
      createdAt
      updatedAt
    }
  }
`

export const PostDocument = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        id
        name
      }
      likeCount
      likedByMe
      createdAt
      updatedAt
    }
  }
`
