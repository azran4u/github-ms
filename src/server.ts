// import { RestApi } from './api/rest';
// import { GraphqlApi } from './api/graphql';
import { MongoDbPlayground, MongoDBServerInMemory } from './db';
import { ILogger, Logger } from './logger';

class Server {
  public static async start(): Promise<void> {
    const logger: ILogger = new Logger('Server');
    try {
      const inMemoryMongoDb = new MongoDBServerInMemory();
      await inMemoryMongoDb.init();
      await new MongoDbPlayground().run();
      await inMemoryMongoDb.finish();
      process.exit();
      //   new RestApi().init();
      //   new GraphqlApi().init();
    } catch (err) {
      logger.error('could not start server');
      logger.debug(err);
    }
  }
}

Server.start();
