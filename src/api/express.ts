import express from 'express';
import helmet from 'helmet';
import { Logger, ILogger } from '../logger';
import { IConfig, Config } from '../config';
import { Middlewares, RouteHandlers } from '.';

export class Express {
  private logger: ILogger;
  private config: IConfig;
  private routeHandler: RouteHandlers;
  private middlewares: Middlewares;

  constructor() {
    this.logger = new Logger('ApiServer');
    this.config = Config.getConfig();
    this.routeHandler = new RouteHandlers();
    this.middlewares = new Middlewares();
  }
  public init() {
    const app = express();
    app.use(helmet());
    app.use( this.middlewares.setRequestRecieveTime.bind(this.middlewares));
    app.get('/', this.routeHandler.getUserHandler.bind(this.routeHandler));
    app.use( this.middlewares.calcPerformanceTimes.bind(this.middlewares) );
    app.listen(this.config.server.port, () =>
      this.logger.info('Example app listening on port 3000!'),
    );
  }
}
