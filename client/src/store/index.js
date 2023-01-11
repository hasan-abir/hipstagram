import { reactive } from "vue";
import authController from "@/controllers/authController";
import router from "@/router";

export const store = reactive({
  auth: {
    token: localStorage.getItem("jwtToken"),
    user: null,
    loading: true,
  },
  async getCurrentUser() {
    if (!this.auth.token) {
      this.auth.loading = false;
      return null;
    }

    try {
      const user = await authController.getCurrentUser(this.auth.token);

      this.auth.user = user;
    } catch (err) {
      this.auth.token = null;
      localStorage.removeItem("jwtToken");
      router.push({ name: "login" });
    } finally {
      this.auth.loading = false;
    }
  },
  getUserByUsername(username) {
    return authController.getUserByUsername(username);
  },
  async login(email, password) {
    const token = await authController.login({ email, password });

    this.auth.token = token;
    localStorage.setItem("jwtToken", token);

    await this.getCurrentUser();
    router.push({ name: "home" });
  },
  async register(username, gender, avatar, email, password) {
    const token = await authController.register({
      username,
      gender,
      avatar,
      email,
      password,
    });

    this.auth.token = token;
    localStorage.setItem("jwtToken", token);

    await this.getCurrentUser();
    router.push({ name: "home" });
  },
  logout() {
    this.auth.token = null;
    this.auth.user = null;
    localStorage.removeItem("jwtToken");
    router.push({ name: "login" });
  },
});
