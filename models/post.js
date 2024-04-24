const { Schema, model } = require('mongoose');
const Populate = require('../util/autopopulate');

const postSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subreddit: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  voteScore: { type: Number, default: 0 }
});

postSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))
  .pre('findOne', Populate('comments'))
  .pre('find', Populate('comments'));

module.exports = model('Post', postSchema);