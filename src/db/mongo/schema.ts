import mongoose, { Schema, Document } from 'mongoose';

mongoose.set('useCreateIndex', true);

export interface IComment {
  name: string;
  age: number;
  bio: string;
  date?: Date;
}

export interface IBlogPost extends Document {
  author: string;
  title: string;
  body: string;
  date: string;
  comments?: IComment[];
}

export const ObjectId = Schema.Types.ObjectId;

export const CommentSchema = new Schema({
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
});

export const BlogPostSchema = new Schema({
  author: String,
  title: String,
  body: String,
  date: String,
  comments: [CommentSchema],
});

export default mongoose.model<IBlogPost>('BlogPosts', BlogPostSchema);
