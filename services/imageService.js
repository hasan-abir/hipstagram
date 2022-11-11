const mongoose = require("mongoose");
const imageKit = require("../image_handlers/imageKit");
const User = require("../models/User");
const Image = require("../models/Image");
const throwResponseError = require("../errors/throwResponseError");

const getLatestImages = async (limit = 10, lastItemTimestamp, username) => {
  let authorId = null;

  if (username) {
    const author = await User.exists({ username });

    if (author) {
      authorId = author._id;
    }
  }

  const query = {};

  if (lastItemTimestamp) {
    query.updatedAt = { $lt: lastItemTimestamp };
  }

  if (authorId) {
    query.author = authorId;
  }

  const images = await Image.find(query)
    .sort("-updatedAt")
    .limit(limit)
    .select("file caption updatedAt");
  const next = images.length > 0 ? images[images.length - 1].updatedAt : false;

  return { images, next };
};

const getSingleImage = async (imageId) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const foundImage = await Image.findById(imageId)
    .populate("author", "avatar username -_id")
    .select("-likes -comments -__v");

  if (!foundImage) throwResponseError(404, "Image not found");

  return foundImage;
};

const uploadImage = async (reqBody, reqFile, username) => {
  const { caption = "" } = reqBody;

  let file = {};

  if (!reqFile) throwResponseError(400, "Please select an image to upload.");

  const author = await User.findOne({ username });

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

  let populatedImage = await newImage.populate(
    "author",
    "avatar username -_id"
  );

  populatedImage = populatedImage.toObject();

  delete populatedImage.likes;
  delete populatedImage.comments;
  delete populatedImage._v;

  return populatedImage;
};

const removeImage = async (imageId, username) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const foundImage = await Image.findById(imageId).populate(
    "author",
    "username -_id"
  );

  if (!foundImage) throwResponseError(404, "Image not found");

  if (username !== foundImage.author.username)
    throwResponseError(401, "Unauthorized");

  await imageKit.deleteFile(foundImage.file.fileId);
  await foundImage.remove();
};

const updateImage = async (reqBody, imageId, username) => {
  const { caption } = reqBody;

  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  let foundImage = await Image.findById(imageId)
    .populate("author", "avatar username -_id")
    .select("-likes -comments -__v");

  if (!foundImage) throwResponseError(404, "Image not found");

  if (username !== foundImage.author.username)
    throwResponseError(401, "Unauthorized");

  foundImage.caption = caption;

  await foundImage.save();

  return foundImage;
};

module.exports = {
  getLatestImages,
  getSingleImage,
  uploadImage,
  removeImage,
  updateImage,
};
