import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';
import blogPostModel, { IBlogPost } from './schema';
import { MongoDB } from './mondoDb';
import { Story, Person } from '../mongo';
import mongoose from 'mongoose';

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
      await this.createPerson();
      const data = await this.readPerson();
      await this.mongod.finish();
    } catch (err) {
      this.logger.error('could not run playground');
      this.logger.debug(err);
    }
  }

  private async createBlogPost(n: number): Promise<void> {
    try {
      for (let i = 0; i < n; i++) {
        const blogPost = new blogPostModel({
          author: 'my author name',
          title: 'my title',
          body: 'my post body',
          date: Date.toString(),
        });
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

  public async createPerson(): Promise<void> {
    const author = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Ian Fleming',
      age: 50,
    });

    const story1 = new Story({
      title: 'Casino Royale',
      author: author._id, // assign the _id from the person
    });

    await Promise.all([author.save(), story1.save()]);
  }

  public async readPerson(): Promise<mongoose.Document[]> {
    return await Story.find().populate('author');
  }
}
