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
  const res = await axios.post(routePrefix + "register", user, {
    headers: keyHeader,
  });

  return res.data.token;
};

export default { getCurrentUser, getUserByUsername, login, register };
