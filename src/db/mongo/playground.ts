import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';
import blogPostModel, { IBlogPost } from './schema';
import { MongoDB } from './mondoDb';

export class MongoDbPlayground {
  private logger: ILogger;
  private config: IConfig;
  private mongod: MongoDB;

  constructor() {
    this.logger = new Logger('mongoDB');
    this.config = Config.getConfig();
    this.mongod = new MongoDB();
  }

  public async run(): Promise<void> {
    try {
      await this.mongod.init();
      await this.createBlogPost(100);
      await this.readAllBlogPosts();
      await this.mongod.finish();
    } catch (err) {
        this.logger.error('could not run playground');
        this.logger.debug(err);
      }
  }

  private async createBlogPost(n: number): Promise<void> {
    try {
      for (let i = 0; i < n; i++) {
        const blogPost = new blogPostModel();
        blogPost.author = 'my author name';
        blogPost.title = 'my title';
        blogPost.body = 'my post body';
        blogPost.date = Date.toString();
        await blogPost.save();
      }
      this.logger.info('saved data to mongo');
    } catch (err) {
      this.logger.error('could not create blog post');
      this.logger.debug(err);
    }
  }

  private async readAllBlogPosts(): Promise<IBlogPost[]> {
    try {
      const res = await blogPostModel.find();
      this.logger.info(`number of blog posts found: ${res.length}`);
      return res;
    } catch (err) {
      this.logger.error('error while finding blog posts');
      this.logger.debug(err);
    }
  }
}
