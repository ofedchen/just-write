import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    API_URL: JSON.stringify(
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api`
        : "http://localhost:5000"
    ),
  },
  build: {
    outDir: "dist",
  },
});
