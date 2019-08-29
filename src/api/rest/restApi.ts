import express from 'express';
import helmet from 'helmet';
import { Logger, ILogger } from '../../logger';
import { IConfig, Config } from '../../config';
import { Middlewares, RouteHandlers } from '.';
import * as http from 'http';

export class RestApi {
  private logger: ILogger;
  private config: IConfig;
  private routeHandler: RouteHandlers;
  private middlewares: Middlewares;
  private app: express.Express;
  private server: http.Server;

  constructor() {
    this.logger = new Logger('ApiServer');
    this.config = Config.getConfig();
    this.routeHandler = new RouteHandlers();
    this.middlewares = new Middlewares();
    this.app = express();
  }
  public init() {
    this.app.use(this.middlewares.setRequestReceiveTime.bind(this.middlewares));
    this.app.use(helmet());
    this.app.get('/', this.routeHandler.getUserHandler.bind(this.routeHandler));
    this.app.use(this.middlewares.calcPerformanceTimes.bind(this.middlewares));
    this.server = this.app.listen(this.config.api.rest.port, () =>
      this.logger.info(`RestApi server ready at port ${this.config.api.rest.port}`),
    );
  }

  // for testing purpose
  public getApp(): express.Express {
    return this.app;
  }

  public close() {
    this.server.close();
  }
}
