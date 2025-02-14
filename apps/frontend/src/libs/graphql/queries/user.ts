import { gql } from "graphql-tag"

export const MeDocument = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`
