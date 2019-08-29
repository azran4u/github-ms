import express from 'express';
import { Logger, ILogger } from '../../logger';

export class Middlewares {
  private logger: ILogger;
  constructor() {
    this.logger = new Logger('Middlewares');
  }

  public setRequestReceiveTime(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.locals.t0 = Date.now();
    next();
  }

  public calcPerformanceTimes(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const t0 = res.locals.t0;
    const t1 = res.locals.t1;
    const t2 = res.locals.t2;
    const t3 = Date.now();

    this.logger.info(
      `endpoint: ${req.url} handle time=${t1 -
        t0 +
        t3 -
        t2}ms backend time=${t2 - t1}ms`,
    );
    next();
  }
}
