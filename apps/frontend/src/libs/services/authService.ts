import { gql } from "@apollo/client"
import { LoginParams, RegisterParams } from "../types/auth"
import { client } from "./client"

export class AuthService {
  async register(params: RegisterParams): Promise<string> {
    const REGISTER_MUTATION = gql`
      mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password)
      }
    `

    const response = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: params,
    })

    return response.data.register
  }

  async login(params: LoginParams): Promise<string> {
    const LOGIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `

    const response = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: params,
    })

    return response.data.login
  }
}
