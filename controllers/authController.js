const router = require("express")();
const multerUpload = require("../image_handlers/multerUpload");
const {
  registerUser,
  loginUser,
  getUserByUsername,
} = require("../services/authService");
const { verifyTokenMiddleware } = require("../middlewares/verifyToken");

// Get current user
router.get("/currentuser", verifyTokenMiddleware, async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.username);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Get user by username
router.get("/user/:username", async (req, res, next) => {
  try {
    const user = await getUserByUsername(req.params.username);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Register a user
router.post(
  "/register",
  multerUpload.single("avatar"),
  async (req, res, next) => {
    try {
      const token = await registerUser(req.body, req.file);

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const token = await loginUser(req.body);

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
