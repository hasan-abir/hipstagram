const mongoose = require("mongoose");
const imageKit = require("../image_handlers/imageKit");
const User = require("../models/User");
const Image = require("../models/Image");
const throwResponseError = require("../errors/throwResponseError");

const getLatestImages = async (limit = 10, lastItemTimestamp) => {
  try {
    const query = lastItemTimestamp
      ? {
          updatedAt: { $lt: lastItemTimestamp },
        }
      : null;

    const images = await Image.find(query)
      .sort("-updatedAt")
      .limit(limit)
      .select("file caption updatedAt");
    const next = images[images.length - 1].updatedAt;

    return { images, next };
  } catch (err) {
    throw err;
  }
};

const uploadImage = async (reqBody, reqFile, username) => {
  try {
    const { caption = "" } = reqBody;

    let file = {};

    if (!reqFile) throwResponseError(400, "Please select an image to upload.");

    const author = await User.findOne({ username });

    if (!author) throwResponseError(404, "User doesn't exist");

    const response = await imageKit.upload({
      file: reqFile.buffer.toString("base64"),
      fileName: reqFile.originalname,
      folder: "hipstagram_content",
    });

    file = {
      url: response.url,
      fileId: response.fileId,
    };

    let newImage = new Image({
      file,
      author,
      caption,
    });

    await newImage.save();

    return await newImage.populate("author", "avatar username -_id");
  } catch (err) {
    throw err;
  }
};

const removeImage = async (imageId, username) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(imageId))
      throwResponseError(404, "Image not found");

    const foundImage = await Image.findById(imageId).populate(
      "author",
      "avatar username -_id"
    );

    if (!foundImage) throwResponseError(404, "Image not found");

    if (username !== foundImage.author.username)
      throwResponseError(401, "Unauthorized");

    await imageKit.deleteFile(foundImage.file.fileId);
    await foundImage.remove();
  } catch (err) {
    throw err;
  }
};

const updateImage = async (reqBody, imageId, username) => {
  try {
    const { caption } = reqBody;

    if (!mongoose.Types.ObjectId.isValid(imageId))
      throwResponseError(404, "Image not found");

    let foundImage = await Image.findById(imageId).populate(
      "author",
      "avatar username -_id"
    );

    if (!foundImage) throwResponseError(404, "Image not found");

    if (username !== foundImage.author.username)
      throwResponseError(401, "Unauthorized");

    foundImage.caption = caption;

    await foundImage.save();

    return foundImage;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getLatestImages,
  uploadImage,
  removeImage,
  updateImage,
};
