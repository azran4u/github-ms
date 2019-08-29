import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Repo {
    name: String,
    id: String,
    isPrivate: Boolean,
    url: String,
    size: Int,
  }

  type User {
    name: String,
    id: String,
    repos: [Repo],
    url: String,
    diskUsage: Int,
  }

  type Query {
    books: [Book]
    getUser: User
  }
`;
