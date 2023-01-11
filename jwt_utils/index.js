const jwt = require("jsonwebtoken");

const jwtVerifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const jwtGenerateToken = (user) => {
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

module.exports = { jwtVerifyToken, jwtGenerateToken };
