import express from 'express';
import { Logger, ILogger } from '../logger';

export class Middlewares {
  private logger: ILogger;
  constructor() {
    this.logger = new Logger('Middlewares');
  }

  public setRequestRecieveTime(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.locals.t0 = new Date().getTime().toString();
    next();
  }

  public calcPerformanceTimes(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const t0 = +res.locals.t0;
    const t1 = +res.locals.t1;
    const t2 = +res.locals.t2;
    const t3: number = new Date().getTime();

    this.logger.info(`time from rcv to start handle=${t1 - t0}ms`);
    this.logger.info(`time of backend=${t2 - t1}ms`);
    this.logger.info(`time from end of backend to response=${t3 - t2}ms`);
    next();
  }
}
