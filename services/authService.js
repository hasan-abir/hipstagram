const User = require("../models/User");
const { jwtGenerateToken } = require("../jwt_utils");
const uploadImg = require("../image_handlers/uploadImg");
const throwResponseError = require("../errors/throwResponseError");

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username }).select(
      "-password -_id -__v -uploadedImages"
    );

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

    return jwtGenerateToken(newUser);
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

    return jwtGenerateToken(foundUser);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUserByUsername,
  registerUser,
  loginUser,
};
