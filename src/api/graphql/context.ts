import { GitHubConnector } from '../../connector';
import { Request, Response } from 'express';

export interface GraphQLContext {
  connector: GitHubConnector;
  req: Request;
}

export class GraphQLContextFactory {
  public static createContext({
    req,
    res
  }: {
    req: Request;
    res: Response;
  }): GraphQLContext {
    return {
      connector: new GitHubConnector(),
      req
    } as GraphQLContext;
  }
}
