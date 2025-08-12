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
      "../../test-setup/app-setup.ts",
    ],

    // 앱별 특수 설정
    testTimeout: 15000,

    // Mock 설정
    mockReset: true,
    clearMocks: true,

    // 앱 테스트 패턴
    include: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
  },

  // 패키지 간 의존성 해결
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "../ui/src"),
      "@design-tokens": path.resolve(__dirname, "../design-token/src"),
    },
  },
});
