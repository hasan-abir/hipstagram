const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    file: {
      url: {
        type: String,
      },
      fileId: {
        type: String,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = Image = mongoose.model("Image", imageSchema);
