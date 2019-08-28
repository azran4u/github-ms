import express from 'express';
import { GitHubConnector } from '../connector';
import { Logger, ILogger } from '../logger';

export class RouteHandlers {
  private logger: ILogger;
  private githubConnector: GitHubConnector;
  constructor() {
    this.logger = new Logger('ApiServer');
    this.githubConnector = new GitHubConnector();
  }

  public getUserHandler(req: express.Request, res: express.Response) {
    this.githubConnector
      .getUser()
      .then((user) => {
        res.send(user);
        this.logger.info('fetched user');
      })
      .catch((error) => {
        res.send('could not fetch user');
        this.logger.error('could not fetch user');
      });
  }
}
