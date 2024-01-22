import http from 'http'
import { readFileSync } from 'fs'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { DateTimeResolver } from 'graphql-scalars'

import { Resolvers } from './gen-types'
import { Chat, User } from './entities/models'

const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8' })

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    chats: async () => await Chat.find( { relations: ['author'] }),
    chat: async (_, args) => await Chat.findOne({ where: { id: args.id } }),
    users: async () => await User.find(),
    user: async (_, args) => await User.findOne({ where: { id: args.id } }),
    userByUsername: async (_, args) => await User.findOne({ where: { username: args.username } })
  },
  User: {
    chats: async (parent) => {
      const author = await User.findOne({ where: { id: parent.id } })
      if (author === null) throw new Error('Author not found')
      return await Chat.find({ where: { author } })
    }
  },
  Mutation: {
    addChat: async (_, args) => {
      if (!args.content) throw new Error('Content is required')
      if (!args.author) throw new Error('Author is required')
      if (!args.id) throw new Error('Id is required')
      const author = await User.findOne({ where: { id: args.author } })
      if (!author) throw new Error('Author not found')
      try {
        const chat = Chat.create({
          id: args.id,
          content: args.content,
          author,
          createdAt: new Date()
        })
        await chat.save()
        return chat
      } catch (error) {
        throw new Error(error)
      }
    },
    addUser: async (_, args) => {
      if (!args.username) throw new Error('Username is required')
      try {
        const user = User.create({
          username: args.username
        })
        await user.save()
        return user
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}

interface MyContext {
  dataSources?: {
    // users: Users;
  }
}

export async function setUpServer () {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  })
  await server.start()

  app.use(cors())
  app.use('/', (_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
  })
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token,
        dataSourses: {
          // users: new Users(await UserModel.createCollection())
        }
      })
    })
  )

  app.listen({ port: process.env.PORT }, () => console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`))
}
