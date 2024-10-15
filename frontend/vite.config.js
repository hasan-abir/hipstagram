import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
      }),
    ],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "/__tests__/setGlobal.js",
      deps: {
        inline: ["vuetify"],
      },
    },
    define: { __VITE_API_URL__: JSON.stringify(env.VITE_API_URL) },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
