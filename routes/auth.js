const router = require("express")();
const User = require("../models/User");
const Image = require("../models/Image");
const { validateEmail } = require("../validations/");
const bcrypt = require("bcryptjs");
const imageKit = require("../imageKit/");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
// Testing
router.get("/users", async (req, res) => {
  try {
    const foundUsers = await User.find();

    res.json(foundUsers);
  } catch (err) {
    console.log(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.params.id });

    if (foundUser) {
      if (
        foundUser.avatar.fileId !== "male" &&
        foundUser.avatar.fileId !== "female" &&
        foundUser.avatar.fileId !== "unknown"
      ) {
        await imageKit.deleteFile(foundUser.avatar.fileId);
      }
      await foundUser.remove();
    }

    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log(err);
  }
});
// Testing

router.get("/currentuser", verifyToken, async (req, res) => {
  try {
    let images = [];
    const userDocs = await User.find();

    const imageDocs = await Image.find({ userId: req.userId });

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

router.get("/allusers", async (req, res) => {
  try {
    let images = [];
    const userDocs = await User.find();

    const imageDocs = await Image.find();

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

    res.json({
      users: userDocs,
      images,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.get("/verifyuser", verifyToken, async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.userId });

    res.json({
      id: foundUser._id,
      username: foundUser.username,
      avatar: foundUser.avatar,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.post("/register", (req, res) => {
  const fileUpload = upload.single("avatar");

  fileUpload(req, res, async (err) => {
    const { username, gender, email, password } = req.body;

    try {
      if (username === "" || gender === "" || email === "" || password === "") {
        return res.status(400).json({ msg: "Please provide all the fields." });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ msg: "Please provide a valid email." });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 8 characters long." });
      }

      const foundUser = await User.findOne({ email: email });

      if (foundUser) {
        return res.status(400).json({ msg: "User already exists." });
      }

      if (gender !== "male" && gender !== "female" && gender !== "unknown") {
        return res.status(400).json({ msg: "Invalid gender." });
      }

      if (err) {
        return res
          .status(400)
          .json({ msg: "Maximum file size of 2 MB is accepted" });
      }

      let avatar = {};

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
            folder: "hipstagram_users",
          });

          avatar = {
            url: response.url,
            fileId: response.fileId,
          };
        }
      } else {
        if (gender === "male") {
          avatar = {
            url:
              "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
            fileId: "male",
          };
        }
        if (gender === "female") {
          avatar = {
            url:
              "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/female_15oQfprmU.jpg",
            fileId: "female",
          };
        }
        if (gender === "unknown") {
          avatar = {
            url:
              "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/neutral_zjoy3r1r6b.jpg",
            fileId: "unknown",
          };
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        gender,
        avatar,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token: token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return res.status(400).json({ msg: "Please provide all the fields." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Please provide a valid email." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters long." });
    }

    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(400).json({ msg: "User doesn't exist." });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Password doesn't match." });
    }

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = router;
