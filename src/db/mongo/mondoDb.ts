import { IConfig, Config } from '../../config';
import { ILogger, Logger } from '../../logger';
import mongoose, { Schema, Document } from 'mongoose';

export class MongoDB {
  private logger: ILogger;
  private config: IConfig;
  private connection: mongoose.Connection;
  constructor() {
    this.logger = new Logger('mongoDB');
    this.config = Config.getConfig();
  }
  public init() {
    mongoose
      .connect(
        `mongodb://${this.config.db.mongo.host}:${this.config.db.mongo.port}`,
        {
          useNewUrlParser: false,
        },
      )
      .then(() => {
        this.logger.info(`connected to mongodb`);
        this.connection = mongoose.connection;
      })
      .catch((err) => {
        this.logger.info(`could not connect to mongodb. ${err.message}`);
      });
    const ObjectId = Schema.Types.ObjectId;

    const Comment = new Schema({
      name: { type: String, default: 'hahaha' },
      age: { type: Number, min: 18, index: true },
      bio: { type: String, match: /[a-z]/ },
      date: { type: Date, default: Date.now },
    });

    const BlogPostSchema = new Schema({
      author: ObjectId,
      title: String,
      body: String,
      date: Date,
      comments: [Comment],
    });
    const BlogPost = mongoose.model<IBlogPost>('BlogPosts', BlogPostSchema);
    const post = new BlogPost();
    post.author = 'eyal';
    post.title = 'my first blog';
    post.body = 'the body of my first blog';
    post.date = Date.toString();
    post.comments.push({
      name: 'a',
      age: 22,
      bio: 'abc',
    });
    post.save((err) => {
      if (!err) {
        console.log('Success!');
      }
    });
  }
}

interface IComment {
  name: string;
  age: number;
  bio: string;
  date?: string;
}

interface IBlogPost extends Document {
  author: string;
  title: string;
  body: string;
  date: string;
  comments: IComment[];
}
