import react from "@vitejs/plugin-react"; // 새로운 권장 플러그인
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3001,
    host: "student.localhost",
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 3500,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@mozu/design-token": path.resolve(__dirname, "../design-token"),
      "@mozu/ui": path.resolve(__dirname, "../ui"),
      "@mozu/util-config": path.resolve(__dirname, "../util-config"),
    },
  },
  optimizeDeps: {
    include: [
      "react-router",
      "react-router-dom",
      "@emotion/react",
      "@emotion/utils",
      "@emotion/serialize",
      "@emotion/use-insertion-effect-with-fallbacks",
      "hoist-non-react-statics",
      "scheduler",
      "@mozu/ui",
      "@mozu/design-token",
      "@mozu/util-config",
    ],
    force: true,
  },
});
