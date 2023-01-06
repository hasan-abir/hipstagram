import axios from "axios";
import { keyHeader } from "../headers";

const routePrefix = "/api/auth/";

const getCurrentUser = async (token) => {
  const res = await axios.get(routePrefix + "currentuser", {
    headers: {
      ...keyHeader,
      authorization: "Bearer " + token,
    },
  });

  return res.data;
};

const getUserByUsername = async (username) => {
  const res = await axios.get(routePrefix + "user/" + username, {
    headers: keyHeader,
  });

  return res.data;
};

const login = async (user) => {
  const res = await axios.post(routePrefix + "login", user, {
    headers: keyHeader,
  });

  return res.data.token;
};

const register = async (user) => {
  let data = null;
  if (user.avatar) {
    const formData = new FormData();
    formData.set("username", user.username);
    formData.set("gender", user.gender);
    formData.set("avatar", user.avatar);
    formData.set("email", user.email);
    formData.set("password", user.password);

    data = formData;
  } else {
    data = { ...user };
  }
  const res = await axios.post(routePrefix + "register", data, {
    headers: keyHeader,
  });

  return res.data.token;
};

export default { getCurrentUser, getUserByUsername, login, register };
