import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';
import mongoose from 'mongoose';

export class MongoDB {
  private logger: ILogger;
  private config: IConfig;
  private connection: mongoose.Connection;

  constructor() {
    this.logger = new Logger('mongoDB');
    this.config = Config.getConfig();
  }

  public async init(): Promise<void> {
    try {
      await mongoose.connect(this.config.db.mongo.uri, {
        useNewUrlParser: true
      });
      mongoose.set('useCreateIndex', true);
      this.connection = mongoose.connection;
      this.logger.info(`connected to mongodb`);
    } catch (err) {
      this.logger.info(`could not connect to mongodb. ${err.message}`);
    }
  }

  public async finish(): Promise<void> {
    try {
      this.connection.close();
      this.logger.info(`closed connection to mongodb`);
    } catch (err) {
      this.logger.info(`could not close connection to mongodb. ${err.message}`);
    }
  }
}
