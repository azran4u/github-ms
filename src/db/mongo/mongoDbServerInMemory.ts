import { MongoMemoryServer } from 'mongodb-memory-server';
import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';

export class MongoDBServerInMemory {
  private mongod: MongoMemoryServer;
  private config: IConfig;
  private logger: ILogger;

  constructor() {
    this.mongod = new MongoMemoryServer();
    this.config = Config.getConfig();
    this.logger = new Logger('MongoDBServerInMemory');
  }

  public async init(): Promise<void> {
    try {
      const uri = await this.mongod.getConnectionString();
      this.config.db.mongo.uri = uri;
      this.logger.info('started in memory mongo db server');
    } catch (err) {
      this.logger.error('could not start server');
      this.logger.debug(err);
    }
  }

  public async finish(): Promise<void> {
    try {
      await this.mongod.stop();
      this.logger.info('stopped the in memory mongo db server');
    } catch (err) {
      this.logger.error('could not stop the in memory mongo db server');
      this.logger.debug(err);
    }
  }
}
