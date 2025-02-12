import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  credentials: "include",
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
