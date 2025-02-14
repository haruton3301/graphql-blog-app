import { LoginDocument, RegisterDocument } from "../graphql/mutations/auth"
import {
  LoginMutationVariables,
  RegisterMutationVariables,
} from "../graphql/types"
import { client } from "./client"

export class AuthService {
  async register(params: RegisterMutationVariables): Promise<string> {
    const response = await client.mutate({
      mutation: RegisterDocument,
      variables: params,
    })

    return response.data.register
  }

  async login(params: LoginMutationVariables): Promise<string> {
    const response = await client.mutate({
      mutation: LoginDocument,
      variables: params,
    })

    return response.data.login
  }
}
