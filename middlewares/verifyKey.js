module.exports = (req, res, next) => {
  const key = req.header("x-api-key");

  if (!key) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (key !== process.env.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  next();
};
