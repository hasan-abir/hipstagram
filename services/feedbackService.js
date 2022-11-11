const throwResponseError = require("../errors/throwResponseError");
const mongoose = require("mongoose");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Image = require("../models/Image");

const likeImage = async (imageId, username) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const image = await Image.findById(imageId);

  if (!image) throwResponseError(404, "Image not found");

  const author = await User.findOne({ username });

  const likedByUser = await Like.exists({
    image: imageId,
    author: author._id,
  });

  if (likedByUser) throwResponseError(400, "Image already liked");

  const newLike = new Like({
    author,
    image,
  });

  await newLike.save();

  return await getLikesStatus(imageId, null, true);
};

const unlikeImage = async (imageId, username) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const image = await Image.findById(imageId);

  if (!image) throwResponseError(404, "Image not found");

  const author = await User.findOne({ username });

  const likeFound = await Like.findOne({
    image: imageId,
    author: author._id,
  });

  if (!likeFound) throwResponseError(400, "Image not liked");

  await likeFound.remove();

  return await getLikesStatus(imageId);
};

const getLikes = async (imageId, username) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const image = await Image.exists({ _id: imageId });

  if (!image) throwResponseError(404, "Image not found");

  let userId = null;

  if (username) {
    const user = await User.findOne({ username });

    userId = user._id;
  }

  return await getLikesStatus(imageId, userId);
};

const getLikesStatus = async (imageId, userId, isLiked = false) => {
  if (userId) {
    const likedByUser = await Like.exists({
      image: imageId,
      author: userId,
    });

    isLiked = likedByUser ? true : false;
  }

  const likeCountOnImage = await Like.countDocuments({ image: imageId });

  return {
    likesCount: likeCountOnImage,
    isLiked,
  };
};

const commentOnImage = async (reqBody, imageId, username) => {
  const { text } = reqBody;

  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const image = await Image.findById(imageId);

  if (!image) throwResponseError(404, "Image not found");

  const author = await User.findOne({ username });

  const newComment = new Comment({
    text,
    image,
    author,
  });

  await newComment.save();

  let populatedComment = await newComment.populate(
    "author",
    "avatar username -_id"
  );

  populatedComment = populatedComment.toObject();

  delete populatedComment.image;

  return populatedComment;
};

const removeCommentFromImage = async (commentId, username) => {
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throwResponseError(404, "Comment not found");

  const comment = await Comment.findById(commentId);

  if (!comment) throwResponseError(404, "Comment not found");

  const user = await User.exists({ username });

  if (comment.author.toString() !== user._id.toString())
    throwResponseError(400, "User doesn't have the permission");

  await comment.remove();
};

const getLatestComments = async (imageId, limit = 10, lastItemTimestamp) => {
  if (!mongoose.Types.ObjectId.isValid(imageId))
    throwResponseError(404, "Image not found");

  const image = await Image.exists({ _id: imageId });

  if (!image) throwResponseError(404, "Image not found");

  const query = lastItemTimestamp
    ? {
        image: imageId,
        updatedAt: { $lt: lastItemTimestamp },
      }
    : { image: imageId };

  const comments = await Comment.find(query)
    .sort("-updatedAt")
    .limit(limit)
    .select("-image")
    .populate("author", "avatar username -_id");

  const next =
    comments.length > 0 ? comments[comments.length - 1].updatedAt : false;

  return { comments, next };
};

module.exports = {
  likeImage,
  unlikeImage,
  getLikes,
  commentOnImage,
  removeCommentFromImage,
  getLatestComments,
};
