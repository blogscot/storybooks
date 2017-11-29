const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
  },
  allowedComments: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      commentBody: {
        type: String,
        required: true,
      },
      commentDate: {
        type: Date,
        default: Date.now,
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
})

module.exports = mongoose.model('stories', StorySchema, 'stories')
