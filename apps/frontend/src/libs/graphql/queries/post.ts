import { gql } from "graphql-tag"

export const GetPostsDocument = gql`
  query GetPosts($searchTerm: String, $userIdFilter: String) {
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

export const GetPostDocument = gql`
  query GetPost($id: ID!) {
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
