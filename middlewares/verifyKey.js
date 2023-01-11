module.exports = (req, res, next) => {
  const key = req.header("x-api-key");

  if (!key) {
    return res.status(401).json({ msg: "Unauthorized: No key provided" });
  }

  if (key !== process.env.API_KEY) {
    return res.status(401).json({ msg: "Unauthorized: Key doesn't match" });
  }

  next();
};
