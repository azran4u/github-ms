// import { RestApi } from './api/rest';
// import { GraphqlApi } from './api/graphql';
import { MongoDbPlayground, MongoDBServerInMemory } from './db';
import { ILogger, Logger } from './logger';

class Server {
  public static async start(): Promise<void> {
    const logger: ILogger = new Logger('Server');
    try {
      await new MongoDBServerInMemory().init();
      await new MongoDbPlayground().run();
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
