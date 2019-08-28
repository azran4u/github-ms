import express from 'express';
import { GitHubConnector } from '../connector';
import { Logger, ILogger } from '../logger';

export class RouteHandlers {
  private logger: ILogger;
  private githubConnector: GitHubConnector;
  constructor() {
    this.logger = new Logger('RouteHandler');
    this.githubConnector = new GitHubConnector();
  }

  public getUserHandler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.locals.t1 = new Date().getTime().toString();
    this.githubConnector
      .getUser()
      .then((user) => {
        res.locals.t2 = new Date().getTime().toString();
        this.logger.info('fetched user');
        res.send(user);
        next();
      })
      .catch((error) => {
        res.locals.t2 = new Date().getTime().toString();
        res.send('could not fetch user');
        this.logger.error('could not fetch user');
        next();
      });
  }
}
