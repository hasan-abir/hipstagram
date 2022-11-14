import { reactive } from "vue";

export const store = reactive({
  auth: {
    token: {},
  },
  logout() {
    this.auth.token = null;
  },
});
