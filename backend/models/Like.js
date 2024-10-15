const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  },
  { timestamps: true }
);

module.exports = Like = mongoose.model("Like", likeSchema);
