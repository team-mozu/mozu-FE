import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // 새로운 권장 플러그인
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: "student.localhost",
    cors: true,
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 3500,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@mozu/design-token": path.resolve(
        __dirname,
        "../design-token/src/index.ts"
      ),
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
      "@babel/runtime/helpers/esm/extends",
      "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose",
      "@babel/runtime/helpers/esm/inheritsLoose",
      "@babel/runtime/helpers/esm/assertThisInitialized",
    ],
    force: true,
    exclude: ["@babel/runtime"],
  },
});
