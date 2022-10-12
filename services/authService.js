const User = require("../models/User");
const Image = require("../models/Image");
const { generateAccessToken } = require("../jwt_utils");
const uploadImg = require("../image_handlers/uploadImg");
const throwResponseError = require("../errors/throwResponseError");

const currentUser = async (req, res) => {
  try {
    let images = [];
    const userDocs = await User.find();

    const imageDocs = await Image.find({ userId: req.userId });

    images = imageDocs.map((image) => {
      const author = userDocs.filter((user) => user._id == image.userId)[0];

      return {
        _id: image._id,
        image: image.image,
        description: image.description,
        likes: image.likes,
        userId: image.userId,
        username: author.username,
        created: image.created,
      };
    });

    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const allUsers = async (req, res) => {
  try {
    let images = [];
    const userDocs = await User.find();

    const imageDocs = await Image.find();

    images = imageDocs.map((image) => {
      const author = userDocs.filter((user) => user._id == image.userId)[0];

      return {
        _id: image._id,
        image: image.image,
        description: image.description,
        likes: image.likes,
        userId: image.userId,
        username: author.username,
        created: image.created,
      };
    });

    res.json({
      users: userDocs,
      images,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.userId });

    res.json({
      id: foundUser._id,
      username: foundUser.username,
      avatar: foundUser.avatar,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username }).select("-password -_id -__v");

    if (!user) throwResponseError(404, "User doesn't exist");

    return user;
  } catch (err) {
    throw err;
  }
};

const registerUser = async (requestBody, requestFile) => {
  const { username, gender, email, password } = requestBody;

  try {
    if (password.length < 8)
      throwResponseError(400, "Password must be at least 8 characters long");

    const newUser = new User({
      username,
      gender,
      email,
      password,
    });

    await newUser.validate();

    if (requestFile) {
      newUser.avatar = await uploadImg(requestFile, "hipstagram_users");
    } else {
      switch (gender) {
        case "male":
          newUser.avatar = {
            url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
            fileId: "male",
          };
          break;
        case "female":
          newUser.avatar = {
            url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/female_15oQfprmU.jpg",
            fileId: "female",
          };
          break;
        case "other":
          newUser.avatar = {
            url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/neutral_zjoy3r1r6b.jpg",
            fileId: "unknown",
          };
        default:
        // Do nothing
      }
    }

    await newUser.save();

    return generateAccessToken(newUser);
  } catch (err) {
    throw err;
  }
};

const loginUser = async (requestBody) => {
  try {
    const { email, password } = requestBody;

    const foundUser = await User.findOne({ email });

    if (!foundUser) throwResponseError(404, "User doesn't exist");

    const isMatch = await foundUser.comparePassword(password);

    if (!isMatch) throwResponseError(401, "Invalid Credentials");

    return generateAccessToken(foundUser);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  currentUser,
  allUsers,
  verifyUser,
  getUserByUsername,
  registerUser,
  loginUser,
};
