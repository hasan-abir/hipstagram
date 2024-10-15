const router = require("express")();
const { verifyTokenMiddleware } = require("../middlewares/verifyToken");
const multerUpload = require("../image_handlers/multerUpload");
const {
  getLatestImages,
  uploadImage,
  removeImage,
  updateImage,
  getSingleImage,
} = require("../services/imageService");

// Get all latest images (paginated)
router.get("/latest", async (req, res, next) => {
  try {
    const paginatedResult = await getLatestImages(
      req.query.limit,
      req.query.next,
      req.query.username
    );
    res.json(paginatedResult);
  } catch (err) {
    next(err);
  }
});

// Get single image
router.get("/details/:id", async (req, res, next) => {
  try {
    const image = await getSingleImage(req.params.id);
    res.json(image);
  } catch (err) {
    next(err);
  }
});

// Upload image
router.post(
  "/upload",
  verifyTokenMiddleware,
  multerUpload.single("file"),
  async (req, res, next) => {
    try {
      const newImage = await uploadImage(req.body, req.file, req.username);

      res.json(newImage);
    } catch (err) {
      next(err);
    }
  }
);

// Remove image
router.delete("/remove/:id", verifyTokenMiddleware, async (req, res, next) => {
  try {
    await removeImage(req.params.id, req.username);

    res.json({ msg: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

// Update image
router.put("/edit/:id", verifyTokenMiddleware, async (req, res, next) => {
  try {
    const updatedImage = await updateImage(
      req.body,
      req.params.id,
      req.username
    );

    res.json(updatedImage);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
