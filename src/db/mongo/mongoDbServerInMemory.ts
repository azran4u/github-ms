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

  public async init(): Promise<boolean> {
    try {
      const uri = await this.mongod.getConnectionString();
      this.config.db.mongo.uri = uri;
      return true;
    } catch {
      return false;
    }
  }

  public async stopServer(): Promise<boolean> {
    return this.mongod.stop();
  }
}
