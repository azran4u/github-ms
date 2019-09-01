import { RestApi } from './api/rest';
import { GraphqlApi } from './api/graphql';
import { MongoDB, MongoDBServerInMemory } from './db';

class Server {
  public static async start(): Promise<boolean> {
    try {
      const mongoDbInMemory = new MongoDBServerInMemory();
      await mongoDbInMemory.init();
      const mongo = new MongoDB();
      await mongo.init();
      await mongo.createBlogPost(100);
      const data = await mongo.readAllBlogPosts();
      new RestApi().init();
      new GraphqlApi().init();
      return true;
    } catch {
      return false;
    }
  }
}

Server.start();
