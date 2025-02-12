import { secrets } from "./libs/secrets"
import { httpServer, startServer } from "./server"

async function main() {
  await startServer()
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: secrets.API_PORT }, resolve),
  )
  console.log(`🚀 Server ready at http://localhost:${secrets.API_PORT}/`)
}

main()
