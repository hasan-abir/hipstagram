const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  image: {
    url: {
      type: String,
      required: true
    },
    fileId: {
      type: String,
      required: true
    }
  },
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  likes: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("image", imageSchema);
