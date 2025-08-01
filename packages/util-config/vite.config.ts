import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "utilConfig",
      fileName: (format) => `util-config.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "@mozu/ui"],
      output: {
        globals: {
          react: "React",
          "@mozu/ui": "mozuUI",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mozu/ui": path.resolve(__dirname, "../ui"),
    },
  },
});
