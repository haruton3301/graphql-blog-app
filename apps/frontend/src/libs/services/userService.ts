import { MeDocument } from "@/libs/graphql/queries/user"
import { User } from "@/libs/types/user"
import { client } from "./client"

export class UserService {
  async me(): Promise<User | null> {
    const response = await client.query({
      query: MeDocument,
      fetchPolicy: "network-only",
    })

    return response.data.me
  }
}
