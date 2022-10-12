const router = require("express")();
const User = require("../models/User");
const Image = require("../models/Image");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const verifyToken = require("../middlewares/verifyToken");
const imageKit = require("../image_handlers/imageKit");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router.get("/allimages", async (req, res) => {
  try {
    let images = [];

    const imageDocs = await Image.find();
    const userDocs = await User.find();

    images = imageDocs.map((image) => {
      const author = userDocs.filter((user) => user._id == image.userId)[0];

      return {
        _id: image._id,
        image: image.image,
        description: image.description,
        likes: image.likes,
        userId: image.userId,
        username: author.username,
        created: image.created,
      };
    });

    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/add", verifyToken, (req, res) => {
  const fileUpload = upload.single("image");
  const userId = req.userId;

  fileUpload(req, res, async (err) => {
    try {
      const { description } = req.body;

      let image = {};

      if (err) {
        return res
          .status(400)
          .json({ msg: "Maximum file size of 2 MB is accepted" });
      }

      if (req.file) {
        if (
          req.file.mimetype !== "image/png" &&
          req.file.mimetype !== "image/jpg" &&
          req.file.mimetype !== "image/jpeg"
        ) {
          return res
            .status(400)
            .json({ msg: "Please upload only .png or .jpg files." });
        } else {
          const response = await imageKit.upload({
            file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
            folder: "hipstagram_content",
          });

          image = {
            url: response.url,
            fileId: response.fileId,
          };
        }
        const newImage = new Image({
          image,
          userId,
          description,
          likes: 0,
        });

        await newImage.save();

        const author = await User.findOne({ _id: userId });

        res.json({
          _id: newImage._id,
          image: newImage.image,
          description: newImage.description,
          likes: newImage.likes,
          userId: newImage.userId,
          username: author.username,
          created: newImage.created,
        });
      } else {
        return res
          .status(400)
          .json({ msg: "Please select an image to upload." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  });
});

router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const foundImage = await Image.findOne({ _id: req.params.id });
    if (req.userId !== foundImage.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await imageKit.deleteFile(foundImage.image.fileId);
    await foundImage.remove();

    const foundLikes = await Like.find({ imageId: req.params.id });

    foundLikes.forEach(async (like) => {
      await like.remove();
    });

    const foundComments = await Comment.find({ imageId: req.params.id });

    foundComments.forEach(async (comment) => {
      await comment.remove();
    });

    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const { description } = req.body;

    const foundImage = await Image.findOne({ _id: req.params.id });

    if (req.userId !== foundImage.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    foundImage.description = description;

    await foundImage.save();

    res.json({
      msg: "Updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/userlikes", verifyToken, async (req, res) => {
  try {
    const foundLikes = await Like.find({ userId: req.userId });

    res.json(foundLikes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const foundImage = await Image.findOne({ _id: req.params.id });

    foundImage.likes = foundImage.likes + 1;

    const newLike = new Like({
      userId: req.userId,
      imageId: foundImage._id,
    });

    await newLike.save();

    await foundImage.save();

    res.json(newLike);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put("/unlike/:id", verifyToken, async (req, res) => {
  try {
    const foundImage = await Image.findOne({ _id: req.params.id });

    foundImage.likes = foundImage.likes - 1;

    const foundLike = await Like.findOne({
      imageId: foundImage._id,
      userId: req.userId,
    });

    await foundLike.remove();
    await foundImage.save();

    res.json({
      msg: "Unliked",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/allcomments", async (req, res) => {
  try {
    let allComments = [];

    const commentsRes = await Comment.find();

    const usersRes = await User.find();

    allComments = commentsRes.map((comment) => {
      const author = usersRes.filter((user) => user._id == comment.userId)[0];

      return {
        _id: comment._id,
        commentTxt: comment.commentTxt,
        imageId: comment.imageId,
        userId: comment.userId,
        username: author.username,
        created: comment.created,
      };
    });

    res.json(allComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/comment/:id", verifyToken, async (req, res) => {
  try {
    const { commentTxt } = req.body;

    const foundUser = await User.findOne({ _id: req.userId });

    const foundImage = await Image.findOne({ _id: req.params.id });

    if (foundImage) {
      if (commentTxt === "") {
        return res.status(400).json({ msg: "Cannot post empty comment." });
      }

      const newComment = new Comment({
        commentTxt,
        userId: req.userId,
        imageId: foundImage._id,
      });

      await newComment.save();

      res.json({
        _id: newComment._id,
        commentTxt: newComment.commentTxt,
        userId: newComment.userId,
        username: foundUser.username,
        imageId: newComment.imageId,
        created: newComment.created,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
