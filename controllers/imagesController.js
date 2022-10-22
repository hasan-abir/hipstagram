const router = require("express")();
// const User = require("../models/User");
// const Image = require("../models/Image");
// const Like = require("../models/Like");
// const Comment = require("../models/Comment");
const verifyToken = require("../middlewares/verifyToken");
const multerUpload = require("../image_handlers/multerUpload");
const {
  getLatestImages,
  uploadImage,
  removeImage,
  updateImage,
} = require("../services/imageService");

// Get all latest images (paginated)
router.get("/latest", async (req, res, next) => {
  try {
    const paginatedResult = await getLatestImages(
      req.query.limit,
      req.query.next
    );
    res.json(paginatedResult);
  } catch (err) {
    next(err);
  }
});

// Upload image
router.post(
  "/upload",
  verifyToken,
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
router.delete("/remove/:id", verifyToken, async (req, res, next) => {
  try {
    await removeImage(req.params.id, req.username);

    res.json({ msg: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

// Update image
router.put("/edit/:id", verifyToken, async (req, res, next) => {
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

// router.get("/userlikes", verifyToken, async (req, res) => {
//   try {
//     const foundLikes = await Like.find({ userId: req.userId });

//     res.json(foundLikes);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

// router.put("/like/:id", verifyToken, async (req, res) => {
//   try {
//     const foundImage = await Image.findOne({ _id: req.params.id });

//     foundImage.likes = foundImage.likes + 1;

//     const newLike = new Like({
//       userId: req.userId,
//       imageId: foundImage._id,
//     });

//     await newLike.save();

//     await foundImage.save();

//     res.json(newLike);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

// router.put("/unlike/:id", verifyToken, async (req, res) => {
//   try {
//     const foundImage = await Image.findOne({ _id: req.params.id });

//     foundImage.likes = foundImage.likes - 1;

//     const foundLike = await Like.findOne({
//       imageId: foundImage._id,
//       userId: req.userId,
//     });

//     await foundLike.remove();
//     await foundImage.save();

//     res.json({
//       msg: "Unliked",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

// router.get("/allcomments", async (req, res) => {
//   try {
//     let allComments = [];

//     const commentsRes = await Comment.find();

//     const usersRes = await User.find();

//     allComments = commentsRes.map((comment) => {
//       const author = usersRes.filter((user) => user._id == comment.userId)[0];

//       return {
//         _id: comment._id,
//         commentTxt: comment.commentTxt,
//         imageId: comment.imageId,
//         userId: comment.userId,
//         username: author.username,
//         created: comment.created,
//       };
//     });

//     res.json(allComments);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

// router.post("/comment/:id", verifyToken, async (req, res) => {
//   try {
//     const { commentTxt } = req.body;

//     const foundUser = await User.findOne({ _id: req.userId });

//     const foundImage = await Image.findOne({ _id: req.params.id });

//     if (foundImage) {
//       if (commentTxt === "") {
//         return res.status(400).json({ msg: "Cannot post empty comment." });
//       }

//       const newComment = new Comment({
//         commentTxt,
//         userId: req.userId,
//         imageId: foundImage._id,
//       });

//       await newComment.save();

//       res.json({
//         _id: newComment._id,
//         commentTxt: newComment.commentTxt,
//         userId: newComment.userId,
//         username: foundUser.username,
//         imageId: newComment.imageId,
//         created: newComment.created,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

module.exports = router;
