import express, { Application } from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { createServer } from 'http';
import cors from 'cors';
import { createConnection, Connection, Repository, getRepository } from 'typeorm';
import { User, Post, Comment, Like, Notification } from './entity';
import { execute, subscribe } from 'graphql';
import schema from './graphql/schema';
import { graphqlUploadExpress } from 'graphql-upload';
import { ConnectionParams, SubscriptionServer } from 'subscriptions-transport-ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();
const { JWT_SECRET } = process.env;

const getAuthUser = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET as string) as User;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export type Context = {
  orm: {
    userRepository: Repository<User>;
    postRepository: Repository<Post>;
    commentRepository: Repository<Comment>;
    likeRepository: Repository<Like>;
    notificationRepository: Repository<Notification>;
  };
  authUser: User | null;
};

const connection: Promise<Connection> = createConnection();
connection.then(() => {
  startApolloServer();
}).catch(error => console.log("Database connection error: ", error));

async function startApolloServer() {
  const PORT = 8081;
  const app: Application = express();
  app.use(cors());
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const userRepository: Repository<User> = getRepository(User);
  const postRepository: Repository<Post> = getRepository(Post);
  const commentRepository: Repository<Comment> = getRepository(Comment);
  const likeRepository: Repository<Like> = getRepository(Like);
  const notificationRepository: Repository<Notification> = getRepository(Notification);

  const server: ApolloServer = new ApolloServer({ schema, context: ({req}) => {
    const token = req.get('Authorization') || '';
    const authUser = getAuthUser(token.split(' ')[1]);
    const ctx: Context = {
      orm: {
        userRepository: userRepository,
        postRepository: postRepository,
        commentRepository: commentRepository,
        likeRepository: likeRepository,
        notificationRepository:notificationRepository
      },
      authUser: authUser
    };
    return ctx;
  }, plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      }
    }
  }] });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe, onConnect: (connectionParams: ConnectionParams) => {
      const token = connectionParams.get('authToken') || '';
      if (token != '') {
        const authUser = getAuthUser(token.split(' ')[1]);
        return { authUser: authUser }
      }
      throw new AuthenticationError('User is not authenticated');
    } },
    { server: httpServer, path: server.graphqlPath }
  )

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });

  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
}