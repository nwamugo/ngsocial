import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { createConnection, Connection, Repository, getRepository } from 'typeorm';
import { User, Post, Comment, Like, Notification } from './entity';
import schema from './graphql/schema';
import 'reflect-metadata';
// import casual = require("casual");


// let postsIds: string[] = [];
// let usersIds: string[] = [];

// const mocks = {
//   User: () => ({
//     id: () => { let uuid = casual.uuid; usersIds.push(uuid); return uuid },
//     fullName: casual.full_name,
//     bio: casual.text,
//     email: casual.email,
//     username: casual.username,
//     password: casual.password,
//     image: 'https://picsum.photos/seed/picsum/200/300',
//     coverImage: 'https://picsum.photos/seed/picsum/200/300',
//     postsCount: () => casual.integer(0)
//   }),
//   Post: () => ({
//     id: () => { let uuid = casual.uuid; postsIds.push(uuid); return uuid },
//     text: casual.text,
//     image: 'https://picsum.photos/seed/picsum/200/300',
//     author: casual.random_element(usersIds),
//     commentsCount: () => casual.integer(0),
//     likesCount: () => casual.integer(0),
//     latestLike: casual.first_name,
//     createdAt: () => casual.date()
//   }),
//   Comment: () => ({
//     id: casual.uuid,
//     comment: casual.text,
//     post: casual.random_element(postsIds),
//     author: casual.random_element(usersIds),
//     createdAt: () => casual.date()
//   }),
//   Like: () => ({
//     id: casual.uuid,
//     post: casual.random_element(postsIds),
//     user: casual.random_element(usersIds)
//   }),
//   /**
//    * Our mock resolvers return only two results for queries.
//    * We can change this default behavior as follows.
//    * Below, our queries will return between 10 and 100 fake entries
//    */
//   Query: () => ({
//     getPostsByUserId: () => [...new Array(casual.integer(10, 100))],
//     getFeed: () => [...new Array(casual.integer(10, 100))],
//     getNotificationsByUserId: () => [...new Array(casual.integer(10, 100))],
//     getCommentsByPostId: () => [...new Array(casual.integer(10, 100))],
//     getLikesByPostId: () => [...new Array(casual.integer(10, 100))],
//     searchUsers: () => [...new Array(casual.integer(10, 100))]
//   })
// };

export type Context = {
  orm: {
    userRepository: Repository<User>;
    postRepository: Repository<Post>;
    commentRepository: Repository<Comment>;
    likeRepository: Repository<Like>;
    notificationRepository: Repository<Notification>;
  };
};

const connection: Promise<Connection> = createConnection();
connection.then(() => {
  startApolloServer();
}).catch(error => console.log("Database connection error: ", error));

async function startApolloServer() {
  const PORT = 8081;
  const app: Application = express();
  app.use(cors());
  const userRepository: Repository<User> = getRepository(User);
  const postRepository: Repository<Post> = getRepository(Post);
  const commentRepository: Repository<Comment> = getRepository(Comment);
  const likeRepository: Repository<Like> = getRepository(Like);
  const notificationRepository: Repository<Notification> = getRepository(Notification);
  const context: Context = {
    orm: {
      userRepository: userRepository,
      postRepository: postRepository,
      commentRepository: commentRepository,
      likeRepository: likeRepository,
      notificationRepository: notificationRepository
    }
  }
  // const server: ApolloServer = new ApolloServer({schema, mocks: true, mockEntireSchema: false});
  const server: ApolloServer = new ApolloServer({ schema, context });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql'
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
}
// startApolloServer();