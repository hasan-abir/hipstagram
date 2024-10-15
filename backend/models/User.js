const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    avatar: {
      url: {
        type: String,
      },
      fileId: {
        type: String,
      },
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Must be 'male', 'female' or 'other'",
      },
      required: [true, "Gender required to be specified"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    uploadedImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, {
  message: "User with {PATH} already exists",
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hashPassword = async function () {
  const user = this;

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    await user.hashPassword();

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = User = mongoose.model("User", userSchema);
