const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required"],
    },
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

module.exports = Comment = mongoose.model("Comment", commentSchema);
