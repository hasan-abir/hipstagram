const dotenv = require("dotenv");
const User = require("../models/User");
const { jwtVerifyToken } = require("../jwt_utils");

dotenv.config();

const tokenValidation = async (bearerToken) => {
  try {
    if (!bearerToken) {
      throw new Error("No token authorization");
    }

    const bearer = bearerToken.split(" ");
    const token = bearer[1];

    const verifiedUser = await jwtVerifyToken(token);

    const user = await User.exists({ username: verifiedUser.username });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    return verifiedUser;
  } catch (err) {
    throw err;
  }
};

const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const user = await tokenValidation(req.header("authorization"));

    req.username = user.username;
    req.email = user.email;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized: " + err.message });
  }
};

const optionalVerifyTokenMiddleware = async (req, res, next) => {
  try {
    const bearerToken = req.header("authorization");

    if (bearerToken) {
      const user = await tokenValidation(req.header("authorization"));

      req.username = user.username;
      req.email = user.email;
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized: " + err.message });
  }
};

module.exports = {
  tokenValidation,
  verifyTokenMiddleware,
  optionalVerifyTokenMiddleware,
};
