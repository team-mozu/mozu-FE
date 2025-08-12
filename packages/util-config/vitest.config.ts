import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Node.js 환경에서 토큰 빌드 테스트
    globals: true,
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "build-scripts/**/*.{test,spec}.{js,ts}",
    ],
  },
});
