import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ProfileView from "@/views/ProfileView.vue";
import UserView from "@/views/UserView.vue";
import ImageDetailsView from "@/views/ImageDetailsView.vue";
import { store } from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "/image/:id",
          name: "image-details",
          component: ImageDetailsView,
        },
      ],
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
    {
      path: "/user/:username",
      name: "user",
      component: UserView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  await store.getCurrentUser();

  const publicRoutes = ["home", "register", "login", "image-details", "user"];

  if (!publicRoutes.includes(to.name) && !store.auth.user) {
    next({ name: "login" });
  } else if (
    (to.name === "register" || to.name === "login") &&
    store.auth.user
  ) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
