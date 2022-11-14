import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { registerPlugins } from "@/plugins";
import vuetify from "./plugins/vuetify";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

registerPlugins(app);

app.use(vuetify);

app.mount("#app");
