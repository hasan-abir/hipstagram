const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatar: {
    url: {
      type: String,
      required: true
    },
    fileId: {
      type: String,
      required: true
    }
  },
  username: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", userSchema);
