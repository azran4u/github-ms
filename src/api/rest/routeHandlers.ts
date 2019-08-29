import express from 'express';
import { GitHubConnector } from '../../connector';
import { Logger, ILogger } from '../../logger';
import { User } from '../../model';

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
    next: express.NextFunction
  ) {
    res.locals.t1 = Date.now();
    this.githubConnector
      .getUser()
      .then((user: User) => {
        res.locals.t2 = Date.now();
        this.logger.info('fetched user');
        res.send(user);
        next();
      })
      .catch((error: Error) => {
        res.locals.t2 = Date.now();
        res.send('could not fetch user');
        this.logger.error('could not fetch user');
        next();
      });
  }
}
