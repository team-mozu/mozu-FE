import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "../../scripts/vitest/app-setup.ts",
    ],
    testTimeout: 15000,

    include: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
  },

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@mozu/design-token": path.resolve(__dirname, "../design-token/src"),
      "@mozu/ui": path.resolve(__dirname, "../ui/src"),
      "@mozu/util-config": path.resolve(__dirname, "../util-config/src"),
    },
  },
});
