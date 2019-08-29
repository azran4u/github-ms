import express from 'express';
import { Logger, ILogger } from '../logger';
import { IConfig, Config } from '../config';
import { RouteHandlers } from './rest/routeHandlers';

export class ApiServer {
  private logger: ILogger;
  private config: IConfig;
  private routeHandler: RouteHandlers;

  constructor() {
    this.logger = new Logger('ApiServer');
    this.config = Config.getConfig();
    this.routeHandler = new RouteHandlers();
  }
  public init() {
    const app = express();

    app.get(
      '/',
      this.routeHandler.getUserHandler.bind(this.routeHandler)
    );

    app.listen(this.config.server.port, () =>
      this.logger.info('Example app listening on port 3000!')
    );
  }
}
