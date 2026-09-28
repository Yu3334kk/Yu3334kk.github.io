import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// base 用相对路径，这样部署到 GitHub Pages 的项目子路径（/仓库名/）下也能正常加载资源
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
