import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';
import mongoose from 'mongoose';
import blogPostModel, { IBlogPost, IComment } from './schema';

export class MongoDB {
  private logger: ILogger;
  private config: IConfig;

  constructor() {
    this.logger = new Logger('mongoDB');
    this.config = Config.getConfig();
  }

  private async connect(): Promise<boolean> {
    try {
      mongoose.connect(this.config.db.mongo.uri, {
        useNewUrlParser: true
      });
      mongoose.set('useCreateIndex', true);
      return true;
    } catch {
      return false;
    }
  }

  public async createBlogPost(n: number): Promise<boolean> {
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
      return true;
    } catch (err) {
      this.logger.error('could not create blog post');
      this.logger.debug(err);
      return false;
    }
  }

  public async readAllBlogPosts(): Promise<IBlogPost[]> {
    try {
      const res = await blogPostModel.find();
      this.logger.info(`number of blog posts found: ${res.length}`);
      return res;
    } catch (err) {
      this.logger.error('error while finding blog posts');
      this.logger.debug(err);
    }
  }

  public async init(): Promise<boolean> {
    try {
      await this.connect();
      this.logger.info(`connected to mongodb`);
      return true;
    } catch (err) {
      this.logger.info(`could not connect to mongodb. ${err.message}`);
      return false;
    }
  }
}
