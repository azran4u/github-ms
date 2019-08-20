import * as winston from 'winston';
import { ILogger } from './ILogger';

export class Logger extends ILogger {
  private logger: winston.Logger;

  public constructor(componentLabel: string) {
    super(componentLabel);
    const myFormat = winston.format.printf(
      ({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      },
    );
    this.logger = winston.createLogger({
      level: 'info',
      defaultMeta: { label: this.label },
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        myFormat,
      ),
      transports: [new winston.transports.Console({ level: 'info' })],
    });
    if (process.env.LOG_LEVEL === 'debug') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
          level: 'debug',
        }),
      );
    }
  }

  public info(message: string): void {
    this.logger.info(message);
  }
  public error(message: string): void {
    this.logger.error(message);
  }
  public debug(object: any): void {
    this.logger.debug(object);
  }
}
