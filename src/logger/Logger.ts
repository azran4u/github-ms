import * as winston from 'winston';
import { ILogger } from './ILogger';
import { Config, IConfig } from '../config';

export class Logger extends ILogger {
  private logger: winston.Logger;
  private config: IConfig;

  public constructor(componentLabel: string) {
    super(componentLabel);
    this.config = Config.getConfig();
    const myFormat = winston.format.printf(
      ({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      }
    );
    this.logger = winston.createLogger({
      level: 'info',
      defaultMeta: { label: this.label },
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        myFormat
      ),
      transports: [new winston.transports.Console({ level: this.config.logger.logLevel })]
    });
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
