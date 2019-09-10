import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const personSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
});

const storySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

export { Story, Person };
