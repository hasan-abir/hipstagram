const jwt = require("jsonwebtoken");

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRATION,
    }
  );
};

module.exports = { verifyAccessToken, generateAccessToken };
