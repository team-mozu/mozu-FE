import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "UI",
      formats: [
        "es",
        "cjs",
      ],
      fileName: format => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@mozu/design-token": path.resolve(__dirname, "../design-token/src"),
    },
  },
});
