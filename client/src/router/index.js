import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import User from "../views/User.vue";
import axios from "axios";
import { keyHeader } from "../headers";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    async beforeEnter(to, from, next) {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      try {
        await axios.get("/api/auth/verifyuser", {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        });

        next({
          path: "/dashboard",
        });
      } catch (err) {
        next();
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    async beforeEnter(to, from, next) {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      try {
        await axios.get("/api/auth/verifyuser", {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        });

        next({
          path: "/dashboard",
        });
      } catch (err) {
        next();
      }
      next();
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    async beforeEnter(to, from, next) {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      try {
        await axios.get("/api/auth/verifyuser", {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        });
        next();
      } catch (err) {
        next({
          path: "/login",
        });
      }
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    async beforeEnter(to, from, next) {
      const token = document.cookie.substr(13, document.cookie.length - 2);

      try {
        await axios.get("/api/auth/verifyuser", {
          headers: {
            ...keyHeader,
            "auth-token": token,
          },
        });
        next();
      } catch (err) {
        next({
          path: "/login",
        });
      }
    },
  },
  {
    path: "/user/:id",
    name: "user",
    component: User,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
