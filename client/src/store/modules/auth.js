import axios from "axios";
import { keyHeader } from "../../headers";

const state = {
  authError: "",
  token: "",
  isLoggedIn: false,
  verifyingUser: false,
  currentUserId: "",
  currentUsername: "",
  currentUseravatar: {},
  follows: [],
  allUsers: [],
};

const getters = {
  authError: (state) => state.authError,
  isLoggedIn: (state) => state.isLoggedIn,
  verifyingUser: (state) => state.verifyingUser,
  token: (state) => state.token,
  currentUserId: (state) => state.currentUserId,
  currentUsername: (state) => state.currentUsername,
  currentUseravatar: (state) => state.currentUseravatar,
  allUsers: (state) => state.allUsers,
};

const mutations = {
  setAuthError: (state, value) => (state.authError = value),
  setToken: (state, value) => (state.token = value),
  setIsLoggedIn: (state, value) => (state.isLoggedIn = value),
  setVerifyingUser: (state, value) => (state.verifyingUser = value),
  setCurrentUserId: (state, value) => (state.currentUserId = value),
  setCurrentUsername: (state, value) => (state.currentUsername = value),
  setCurrentUseravatar: (state, value) => (state.currentUseravatar = value),
  setAllUsers: (state, value) => (state.allUsers = value),
};

const actions = {
  async verifyUser({ commit }) {
    commit("setVerifyingUser", true);
    try {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      const res = await axios.get("/api/auth/verifyUser", {
        headers: {
          ...keyHeader,
          "auth-token": token,
        },
      });

      commit("setCurrentUserId", res.data.id);
      commit("setCurrentUsername", res.data.username);
      commit("setCurrentUseravatar", res.data.avatar);
      commit("setToken", token);
      commit("setIsLoggedIn", true);
      commit("setVerifyingUser", false);
    } catch (err) {
      document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      commit("setCurrentUserId", "");
      commit("setCurrentUsername", "");
      commit("setCurrentUseravatar", {});
      commit("setToken", "");
      commit("setIsLoggedIn", false);
      commit("setVerifyingUser", false);
    }
  },
  async getCurrentUserImages({ commit, state }, { toggleLoading }) {
    const userImagesRes = await axios.get("/api/auth/currentuser", {
      headers: {
        ...keyHeader,
        "auth-token": state.token,
      },
    });

    const likesRes = await axios.get("/api/images/userlikes", {
      headers: {
        ...keyHeader,
        "auth-token": state.token,
      },
    });

    commit("setUserLikes", likesRes.data, { root: true });

    const commentsRes = await axios.get("/api/images/allcomments", {
      headers: {
        ...keyHeader,
        "auth-token": state.token,
      },
    });

    commit("setAllComments", commentsRes.data, { root: true });

    const images = userImagesRes.data.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    commit("setImages", images, { root: true });
    commit("setFilteredImages", images, { root: true });

    toggleLoading(false);
  },
  async getAllUsers(
    { commit, state },
    { toggleLoading, userId, setData, toggleNoUser }
  ) {
    const allUsersRes = await axios.get("/api/auth/allusers", {
      headers: {
        ...keyHeader,
      },
    });

    if (state.isLoggedIn) {
      const likesRes = await axios.get("/api/images/userlikes", {
        headers: {
          ...keyHeader,
          "auth-token": state.token,
        },
      });
      commit("setUserLikes", likesRes.data, { root: true });
    }

    const commentsRes = await axios.get("/api/images/allcomments", {
      headers: {
        ...keyHeader,
        "auth-token": state.token,
      },
    });

    commit("setAllComments", commentsRes.data, { root: true });

    const users = allUsersRes.data.users;

    commit("setAllUsers", users);

    const foundUser = users.find((user) => user._id === userId);

    if (foundUser) {
      setData({
        username: foundUser.username,
        avatar: foundUser.avatar,
      });

      const images = allUsersRes.data.images.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      const foundImages = images.filter((image) => image.userId === userId);

      commit("setImages", images, { root: true });
      commit("setFilteredImages", foundImages, { root: true });
    } else {
      toggleNoUser(true);
    }

    toggleLoading(false);
  },
  async signup({ commit }, { user, toggleLoading, toggleDisable, setError }) {
    setError("");
    try {
      const formData = new FormData();

      formData.set("username", user.username);
      formData.set("email", user.email);
      formData.set("password", user.password);
      formData.set("gender", user.gender);

      if (user.avatar) {
        formData.set("avatar", user.avatar);
      }

      const res = await axios.post("/api/auth/register", formData, {
        headers: keyHeader,
      });

      document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = `access_token=${res.data.token};`;

      toggleLoading(false);
      toggleDisable(false);

      window.location.pathname = "/dashboard";
    } catch (err) {
      setError(err.response.data.msg);
      toggleLoading(false);
      toggleDisable(false);
    }
  },
  async login({ commit }, { user, toggleLoading, toggleDisable, setError }) {
    setError("");

    try {
      const res = await axios.post("/api/auth/login", user, {
        headers: keyHeader,
      });

      document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = `access_token=${res.data.token};`;

      toggleLoading(false);
      toggleDisable(false);

      window.location.pathname = "/dashboard";
    } catch (err) {
      setError(err.response.data.msg);
      toggleLoading(false);
      toggleDisable(false);
    }
  },
  logout({ commit }) {
    document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    commit("setIsLoggedIn", false);
    window.location.pathname = "/login";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
