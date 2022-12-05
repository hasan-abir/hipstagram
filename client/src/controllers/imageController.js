import axios from "axios";
import { keyHeader } from "../headers";

const routePrefix = "/api/images/";

const getLatestImages = async (limit, next, username) => {
  const res = await axios.get(routePrefix + "latest", {
    headers: keyHeader,
    params: {
      limit,
      next,
      username,
    },
  });

  return res.data;
};

const getSingleImage = async (imageId) => {
  const res = await axios.get(routePrefix + "details/" + imageId, {
    headers: keyHeader,
  });

  return res.data;
};

const uploadImage = async (token, file, caption) => {
  const formData = new FormData();

  formData.set("file", file);
  formData.set("caption", caption);

  const res = await axios.post(routePrefix + "upload", formData, {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const removeImage = async (token, imageId) => {
  const res = await axios.delete(routePrefix + "remove/" + imageId, {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const updateImage = async (token, imageId, caption) => {
  const res = await axios.put(
    routePrefix + "edit/" + imageId,
    { caption },
    {
      headers: {
        ...keyHeader,
        authorization: "Bearer " + token,
      },
    }
  );

  return res.data;
};

export default {
  getLatestImages,
  uploadImage,
  removeImage,
  updateImage,
  getSingleImage,
};
