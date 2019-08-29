import { IResolvers } from 'graphql-tools';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../graphql';

export const resolvers = {
  Query: {
    async getUser(source, args, context, info: GraphQLResolveInfo) {
      return context.connector.getUser();
    }
  }
} as IResolvers<any, GraphQLContext>;
