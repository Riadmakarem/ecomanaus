import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serve em /ecomanaus/; Firebase Hosting e dev servem na raiz.
  // O workflow do GitHub Pages define DEPLOY_TARGET=gh-pages.
  base: process.env.DEPLOY_TARGET === "gh-pages" ? "/ecomanaus/" : "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});