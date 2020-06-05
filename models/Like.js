const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
});

module.exports = Like = mongoose.model("like", likeSchema);
