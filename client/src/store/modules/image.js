import axios from "axios";
import { keyHeader } from "../../headers";

const state = {
  dataLoading: true,
  images: [],
  filteredImages: [],
  userLikes: [],
  allComments: [],
};

const getters = {
  filteredImages: (state) => state.filteredImages,
  dataLoading: (state) => state.dataLoading,
  userLikes: (state) => state.userLikes,
  allComments: (state) => state.allComments,
};

const mutations = {
  setImages: (state, value) => (state.images = value),
  setFilteredImages: (state, value) => (state.filteredImages = value),
  setDataLoading: (state, value) => (state.dataLoading = value),
  setUserLikes: (state, value) => (state.userLikes = value),
  setAllComments: (state, value) => (state.allComments = value),
};

const actions = {
  async fetchFeed({ commit }) {
    const imagesRes = await axios.get("/api/images/allimages", {
      headers: keyHeader,
    });

    const images = imagesRes.data.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    const token = document.cookie.substr(13, document.cookie.length - 2);

    if (token !== "") {
      const likesRes = await axios.get("/api/images/userlikes", {
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      commit("setUserLikes", likesRes.data);
    }
    const commentsRes = await axios.get("/api/images/allcomments", {
      headers: {
        ...keyHeader,
        "auth-token": state.token,
      },
    });

    commit("setAllComments", commentsRes.data);

    commit("setImages", images);
    commit("setFilteredImages", images);

    commit("setDataLoading", false);
  },
  async addImage(
    { commit, state, dispatch },
    { data, toggleLoading, toggleDisabled, setError, setSuccess, clearForm }
  ) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      const formData = new FormData();

      formData.set("description", data.description);
      formData.set("image", data.image);

      const res = await axios.post("/api/images/add", formData, {
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      clearForm();

      setSuccess("Image uploaded!");
      setTimeout(() => {
        setSuccess("");
      }, 5000);

      const images = [res.data, ...state.images];
      const filteredImages = [res.data, ...state.filteredImages];

      commit("setImages", images);
      commit("setFilteredImages", filteredImages);

      toggleLoading(false);
      toggleDisabled(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      } else {
        toggleLoading(false);
        toggleDisabled(false);
        setError(err.response.data.msg);
      }
    }
  },
  async deleteImage({ commit, state, dispatch }, { imageId, toggleModal }) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      await axios.delete(`/api/images/remove/${imageId}`, {
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      let images = [...state.images];
      let filteredImages = [...state.filteredImages];
      let likes = [...state.userLikes];
      let comments = [...state.allComments];

      images = images.filter((image) => image._id !== imageId);
      filteredImages = filteredImages.filter((image) => image._id !== imageId);
      likes = likes.filter((like) => like.imageId !== imageId);
      comments = comments.filter((comment) => comment.imageId !== imageId);

      commit("setImages", images);
      commit("setFilteredImages", filteredImages);
      commit("setUserLikes", likes);
      commit("setAllComments", comments);

      toggleModal(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      }
    }
  },
  async editImage(
    { commit, state, dispatch },
    { description, imageId, toggleEditing, updateDescription }
  ) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      await axios.put(
        `/api/images/edit/${imageId}`,
        {
          description,
        },
        {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        }
      );

      let images = [...state.images];
      let filteredImages = [...state.filteredImages];

      const imageIndex = images.findIndex((image) => image._id === imageId);

      images[imageIndex].description = description;

      commit("setImages", images);

      const filteredImageIndex = filteredImages.findIndex(
        (image) => image._id === imageId
      );

      filteredImages[filteredImageIndex].description = description;

      commit("setFilteredImages", filteredImages);

      updateDescription(description);
      toggleEditing(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      }
    }
  },
  async likeImage(
    { commit, state, dispatch },
    { imageId, toggleLikeDisabled, likes }
  ) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      const res = await axios({
        method: "put",
        url: `/api/images/like/${imageId}`,
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      commit("setUserLikes", [res.data, ...state.userLikes]);

      let images = [...state.images];
      let filteredImages = [...state.filteredImages];

      const imageIndex = images.findIndex((image) => image._id === imageId);

      images[imageIndex].likes = likes;

      commit("setImages", images);

      const filteredImageIndex = filteredImages.findIndex(
        (image) => image._id === imageId
      );

      filteredImages[filteredImageIndex].likes = likes;

      commit("setFilteredImages", filteredImages);

      toggleLikeDisabled(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      }
    }
  },
  async removeLikeImage(
    { commit, state, dispatch },
    { imageId, toggleLikeDisabled, likes }
  ) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      await axios({
        method: "put",
        url: `/api/images/unlike/${imageId}`,
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      commit(
        "setUserLikes",
        [...state.userLikes].filter((like) => like.imageId !== imageId)
      );

      let images = [...state.images];
      let filteredImages = [...state.filteredImages];

      const imageIndex = images.findIndex((image) => image._id === imageId);

      images[imageIndex].likes = likes;

      commit("setImages", images);

      const filteredImageIndex = filteredImages.findIndex(
        (image) => image._id === imageId
      );

      filteredImages[filteredImageIndex].likes = likes;

      commit("setFilteredImages", filteredImages);

      toggleLikeDisabled(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      }
    }
  },
  async commentOnImage(
    { commit, state, dispatch },
    { imageId, toggleCommentDisabled, commentTxt, setComment, clearComment }
  ) {
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      const res = await axios.post(
        `/api/images/comment/${imageId}`,
        { commentTxt },
        {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        }
      );

      commit("setAllComments", [res.data, ...state.allComments]);
      setComment(res.data);

      clearComment();
      toggleCommentDisabled(false);
    } catch (err) {
      if (err.response.status === 401) {
        dispatch("logout", { root: true });
      }
    }
  },
};

export default { state, getters, actions, mutations };
