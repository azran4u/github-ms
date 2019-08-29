import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typedef';
import { resolvers } from './resolvers';
import { Logger, ILogger } from '../../logger';
import { GraphQLContextFactory } from './context';
import {IConfig, Config} from '../../config';

export class GraphqlApi {
  private server: ApolloServer;
  private logger: ILogger;
  private app: express.Application;
  private config: IConfig;

  constructor() {
    this.logger = new Logger('graphqlApi');
    this.config = Config.getConfig();
    this.app = express() as express.Application;
    this.server = new ApolloServer({
      uploads: false,
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      context: ({ req, res }) => {
        return GraphQLContextFactory.createContext({ req, res });
      },
      tracing: true
    });
    this.server.applyMiddleware({ app: this.app, path: '/graphql' });
    this.app.listen(this.config.api.graphql.port);
    this.logger.info(`graphql server ready at port ${this.config.api.graphql.port}`);
  }
}
