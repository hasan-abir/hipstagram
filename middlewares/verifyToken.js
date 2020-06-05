const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifiedUser.id;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};
