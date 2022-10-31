const router = require("express")();
const {
  verifyTokenMiddleware,
  optionalVerifyTokenMiddleware,
} = require("../middlewares/verifyToken");
const {
  likeImage,
  unlikeImage,
  getLikes,
  commentOnImage,
  removeCommentFromImage,
  getLatestComments,
} = require("../services/feedbackService");

// Like an image
router.post(
  "/like/image/:imageId",
  verifyTokenMiddleware,
  async (req, res, next) => {
    try {
      const result = await likeImage(req.params.imageId, req.username);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Unlike an image
router.delete(
  "/unlike/image/:imageId",
  verifyTokenMiddleware,
  async (req, res, next) => {
    try {
      const result = await unlikeImage(req.params.imageId, req.username);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Get like counter (and isLiked value)
router.get(
  "/likes/image/:imageId",
  optionalVerifyTokenMiddleware,
  async (req, res, next) => {
    try {
      const result = await getLikes(req.params.imageId, req.username);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Comment on an image
router.post(
  "/comment/image/:imageId",
  verifyTokenMiddleware,
  async (req, res, next) => {
    try {
      const newComment = await commentOnImage(
        req.body,
        req.params.imageId,
        req.username
      );

      return res.json(newComment);
    } catch (err) {
      next(err);
    }
  }
);

// Get comments (paginated)
router.get("/comments/image/:imageId", async (req, res, next) => {
  try {
    const result = await getLatestComments(
      req.params.imageId,
      req.query.limit,
      req.query.next
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Delete comment from image
router.delete(
  "/comment/:commentId",
  verifyTokenMiddleware,
  async (req, res, next) => {
    try {
      await removeCommentFromImage(req.params.commentId, req.username);

      res.json({ msg: "Comment removed successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
