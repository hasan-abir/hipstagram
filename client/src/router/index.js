import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ProfileView from "@/views/ProfileView.vue";
import { store } from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  await store.getCurrentUser();

  if (
    to.name !== "home" &&
    to.name !== "register" &&
    to.name !== "login" &&
    !store.auth.user
  ) {
    next({ name: "login" });
  } else if (
    (to.name === "register" || to.name === "login") &&
    store.auth.user
  ) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
