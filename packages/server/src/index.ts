import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { createConnection, Connection, Repository, getRepository } from 'typeorm';
import { User, Post, Comment, Like, Notification } from './entity';
import schema from './graphql/schema';
import { graphqlUploadExpress } from 'graphql-upload';
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
  } });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
}