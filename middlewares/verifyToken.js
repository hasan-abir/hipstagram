const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  try {
    const bearerToken = req.header("authorization");

    if (!bearerToken) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const bearer = bearerToken.split(" ");
    const token = bearer[1];

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

    req.username = verifiedUser.username;
    req.email = verifiedUser.email;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};
