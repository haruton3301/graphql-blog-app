import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import cors from "cors"
import express from "express"
import http from "http"
import { context, MyContext } from "./context"
import { secrets } from "./libs/secrets"
import { resolvers } from "./resolvers"
import { typeDefs } from "./schema"

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

async function startServer() {
  await server.start()
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json({ limit: "50mb" }), // for ApolloServer
    expressMiddleware(server, {
      context,
    }),
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: secrets.API_PORT }, resolve),
  )
  console.log(`🚀 Server ready at http://localhost:${secrets.API_PORT}/`)
}

startServer()
