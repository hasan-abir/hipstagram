const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentTxt: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Comment = mongoose.model("comment", commentSchema);
