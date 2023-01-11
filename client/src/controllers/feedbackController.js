import axios from "axios";
import { keyHeader } from "../headers";

const routePrefix = "/api/feedback/";

const likeImage = async (token, imageId) => {
  const res = await axios.post(routePrefix + "like/image/" + imageId, null, {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const unlikeImage = async (token, imageId) => {
  const res = await axios.delete(routePrefix + "unlike/image/" + imageId, {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const getLikesStatus = async (token, imageId) => {
  const headers = {...keyHeader}

  if(token) {
    headers.authorization = "Bearer " + token
  }

  const res = await axios.get(routePrefix + "likes/image/" + imageId, {
    headers
  });

  return res.data;
};

const commentOnImage = async (token, imageId, text) => {
  const res = await axios.post(
    routePrefix + "comment/image/" + imageId,
    { text },
    {
      headers: {
        ...keyHeader,
        authorization: "Bearer " + token,
      },
    }
  );

  return res.data;
};

const removeCommentFromImage = async (token, commentId) => {
  const res = await axios.delete(routePrefix + "comment/" + commentId, {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const getLatestComments = async (imageId, limit, next) => {
  const res = await axios.get(routePrefix + "comments/image/" + imageId, {
    headers: keyHeader,
    params: {
      limit,
      next,
    },
  });

  return res.data;
};

export default {
  likeImage,
  unlikeImage,
  getLikesStatus,
  commentOnImage,
  removeCommentFromImage,
  getLatestComments,
};
