import { defineConfig } from "vite";
import { resolve } from "path";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "@components", replacement: resolve(__dirname, "src/common/components") },
      { find: "@pages", replacement: resolve(__dirname, "src/common/pages") },
      { find: "@login", replacement: resolve(__dirname, "src/login/pages") },
      { find: "@atoms", replacement: resolve(__dirname, "src/atoms") },
      { find: "@utils", replacement: resolve(__dirname, "src/utils") },
      { find: "@assets", replacement: resolve(__dirname, "src/assets") },
    ],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "ws://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
